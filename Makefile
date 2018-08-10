all: build

clean:
	rm -r *.bbl *.blg *.dvi *.fls *.log *.out *.toc *.fdb_latexmk *.aux *.nav *.snm

build: paper.tex
	pdflatex paper || :
	pdflatex paper || :
	bibtex paper || :
	pdflatex paper || :
	pdflatex paper || :

presentation: presentation.tex
	pdflatex presentation || :
	bibtex presentation || :
	pdflatex presentation || :
	pdflatex presentation || :