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

## Running on Mac

* Operating System: macOS
* Python Version: 3.8

## Error Handling

When using Python versions above 3.8, Flask might encounter compatibility issues that lead to errors in the backend functionality. To ensure a smooth experience, it is recommended to use Python 3.8 for this project.

Note on Python Version Compatibility
Please note that the backend is designed to work specifically with Python version 3.8. Attempting to run it on a Python version higher than 3.8 may result in errors, particularly with Flask. If the Python version is higher than 3.8, you will need to create a virtual environment with Python 3.8.

Due to the size of the file, while cloning mac user might need to install Homebrew and subsequently Git Large File Storage (Git LFS), please follow these steps:
Install Homebrew:
`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

Add Homebrew to Your PATH:
`echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/(your computer username)/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"`

Install git LFS:
`brew install git-lfs`
