all: docs

docs: docs/notes.pdf docs/index.html docs/jsdoc/index.html

clean:
	rm -rf docs/*.pdf docs/index.html docs/jsdoc


docs/jsdoc/index.html: p2pweb.js
	./node_modules/.bin/documentation build p2pweb.js -f html -o docs/jsdoc; git add docs/jsdoc

docs/notes.pdf: notes.md pandoc/*
	pandoc pandoc/notes.yml pandoc/template.yml notes.md --template=pandoc/template.html -s -o docs/notes.html
	pandoc pandoc/notes.yml pandoc/template.yml notes.md --latex-engine=xelatex -o docs/notes.pdf

docs/index.html: README.md pandoc/*
	pandoc pandoc/README.yml pandoc/template.yml README.md --template=pandoc/template.html -s -o docs/index.html

