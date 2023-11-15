# COMP3931 Individual Project - LARKS Base

Note: tested working on Python 3.8.10.

## Running the Linter and Tests

To begin you will need to install the requirements by running:
`pip3 install -r requirements.txt`

To run the linter open a terminal in the project's directory and run:
`python3 -m flake8 . --max-line-length=150`

To run the unit tests open a terminal in the project's directory and run:
`python3 -m pytest tests/unit_tests`

To run the functional tests open a terminal in the project's directory and run:
`python3 -m pytest tests/functional_tests`
