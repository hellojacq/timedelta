OUTPUT_FILES := $(shell find static | grep -e "\.less$$"|xargs)
OUTPUT_FILES := $(OUTPUT_FILES:less=css)

LESSC := node_modules/.bin/lessc

all: css deploy

$(LESSC):
	npm install

css: $(LESSC) $(OUTPUT_FILES)

%.css: %.less
	@echo Compiling $< at `date`...
	@$(LESSC) $< > $@ || (rm $@ && say 'Compiling $< failed')
	@echo No errors in $<.

.PHONY: tests test clean deploy full-deploy sync css

tests: test

test:
	@git diff --shortstat
	. env/bin/activate ; flake8 timedelta tests
	. env/bin/activate ; APP_CONFIG=config/test.yaml py.test --pdb --ignore=env

clean:
	echo Deleting $(OUTPUT_FILES)
	@rm $(OUTPUT_FILES)
	echo Deleting pyc files...
	@find . -name '*.py[co]' -exec rm -f '{}' ';'

sync:
	rsync -avz --delete \
		--exclude '*.log' \
		--exclude '*.swp' \
		--exclude 'tags' \
		--exclude 'env' \
		--exclude 'node_modules' \
		--exclude 'tests' \
		--exclude '*.pyc' \
		* root@timedelta.com:/usr/local/timedelta
	ssh root@timedelta.com "chmod a+r /usr/local/timedelta/static/images/*"

bootstrap-remote:
	rm -rf env
	virtualenv --no-site-packages env
	. env/bin/activate ;\
		pip install --upgrade -r requirements.txt ;\
		pip install -e .

restart-remote:
	service nginx reload

deploy-base: test sync 

deploy: deploy-base
	ssh root@timedelta.com "cd /usr/local/timedelta ; make restart-remote"
	ssh root@timedelta.com "cd /usr/local/timedelta ; make upgrade-remote"

full-deploy: deploy-base
	ssh root@timedelta.com "cd /usr/local/timedelta ; make bootstrap-remote"
	ssh root@timedelta.com "cd /usr/local/timedelta ; make restart-remote"
	
watch: css
	fswatch-run . "make css"
