from __future__ import absolute_import

import os.path
import os
import sys
import yaml
import logging.config
from copy import deepcopy


def dict_merge(a, b):
    """Recursively merge two dicts.

    not just simple a['key'] = b['key'], if
    both a and bhave a key who's value is a dict then dict_merge is called
    on both values and the result stored in the returned dictionary.
    """
    if not isinstance(b, dict):
        return b
    result = deepcopy(a)
    for k, v in b.iteritems():
        if k in result and isinstance(result[k], dict):
            result[k] = dict_merge(result[k], v)
        else:
            result[k] = deepcopy(v)
    return result


class ConfigurationError(Exception):
    pass


class Configuration(object):
    """Manages global configuration from YAML files."""

    def __init__(self):
        self.path = None
        self.config = {}

    def load(self):
        """Load config file path and recurse up "extends" path to base config.
        """
        cwd = os.getcwd()
        if cwd not in sys.path:
            sys.path.insert(0, cwd)

        self.config = {}

        if 'APP_CONFIG' not in os.environ:
            raise ConfigurationError('APP_CONFIG is not specified')

        self.path = os.environ['APP_CONFIG']
        self.path = os.path.expandvars(self.path)
        self.path = os.path.abspath(self.path)
        self.name = os.path.basename(self.path).split('.')[0]

        if not os.path.exists(self.path):
            raise ConfigurationError(
                'You specified APP_CONFIG to be at %s, but that file does '
                'not exist!'
                % (self.path,)
            )

        self.config = self.load_from_file(self.path)

    def load_from_file(self, filename):
        """Load configuration from the given filename

        Raises ConfigurationError if the environment is not set or if the
        config path does not exist.
        """
        try:
            config = self._load_from_file(filename)
            if not config:
                raise ValueError('Empty config')
            return config

        except ValueError, e:
            raise ConfigurationError(
                'Error loading config from %s: %s'
                % (filename, str(e))
            )

    @staticmethod
    def _load_from_file(filename):
        """Internal recursive file loader."""
        print "config -- reading {}".format(filename)
        if not os.path.exists(filename):
            raise Exception('{0} does not exist'.format(filename))
        with open(filename, 'r') as f:
            config = yaml.safe_load(f)

        extends = config.pop('extends', None)
        if extends:
            extends = os.path.abspath(
                os.path.join(os.path.dirname(filename), extends))
            config = dict_merge(config,
                                Configuration._load_from_file(extends))

        return config

    def get(self, key, default=None):
        """Get the configuration for a specific variable, using dots as
        delimiters for nested objects. Example: config.get('api.host')
        returns the value of self.config['api']['host'] or None if any
        of those keys does not exist. The default return value can be
        overridden.
        """
        value = self.config
        for k in key.split('.'):
            try:
                value = value[k]
            except KeyError:
                return default

        # sys.stderr.write('config: %s=%r\n' % (key, value))
        return value


CONFIG = Configuration()
CONFIG.load()


def get(*args, **kwargs):
    """Passthrough to singleton configuration object."""
    return CONFIG.get(*args, **kwargs)

logging.config.dictConfig(CONFIG.get('logging'))
