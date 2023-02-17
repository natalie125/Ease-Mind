import pytest
from app import db, models
from pathlib import Path
import datetime


@pytest.mark.unit
def test1():
    assert 5 == 5


def test_login_database():
    error0 = True
    # test that the login database can be created
    try:
        db.create_all('test')
    except Exception as e:  # noqa: F841
        error0 = False

    try:
        # test for empty email
        test_entry = models.User_Login_Test(email="", password="password")
        db.session.add(test_entry)
    except AssertionError as e:
        # nice the database raised an assertion error
        error1 = str(e)

    try:
        # test for email without "@" symbol
        test_entry = models.User_Login_Test(email="nope", password="password")
        db.session.add(test_entry)
    except AssertionError as e:
        # nice the database raised an assertion error
        error2 = str(e)

    try:
        # test for already taken email
        test_entry = models.User_Login_Test(email="already@taken.com", password="password")
        db.session.add(test_entry)
        test_entry = models.User_Login_Test(email="already@taken.com", password="password")
        db.session.add(test_entry)
    except AssertionError as e:
        # nice the database raised an assertion error
        error3 = str(e)

    try:
        # test for empty password
        test_entry = models.User_Login_Test(email="Pass@email.com", password="")
        db.session.add(test_entry)
    except AssertionError as e:
        # nice the database raised an assertion error
        error4 = str(e)

    assert (error1 == "No email provided" and error2 == 'Email address missing "@" symbol'
            and error3 == "Email is already in use" and error4 == "No password provided" and error0)


# unit tests for the database of Alex's family pedigree app "Canopy"
def test_canopy_database():
    # list of errors to be output, if list is empty we've passed all tests!
    errors = []

    # test that the database can be created
    try:
        db.create_all('canopy_test')
    except Exception as e:
        errors.append("Error while trying to create the tables with bind key 'canopy_test': " + str(e))

    # test that database file "canopy_test.db" exists, starting location for path being tests/unit_tests
    path = Path("canopy_test.db")
    if not Path.is_file(path):
        errors.append("canopy_test.db not in this path: " + str(path))

    # test adding and reading entries for each table
    # test that we can add entries to the Pedigree_Tree_Test table
    try:
        tree = models.Pedigree_Tree_Test(name="Test Tree", owner="test@gmail.com")
        db.session.add(tree)
        db.session.commit()
    except Exception as e:
        errors.append("Error while adding entries to Pedigree_Tree_Test table: " + str(e))

    # test that the entry in the Pedigree_Tree_Test table has the correct information
    try:
        tree_query = models.Pedigree_Tree_Test.query.first()
        if tree_query.name != "Test Tree":
            errors.append("Query from tree table doesn't have the correct name, instead contains: " + tree_query.name)
        if tree_query.owner != "test@gmail.com":
            errors.append("Query from tree table doesn't have the correct owner's email, instead contains: " + tree_query.owner)
    except Exception as e:
        errors.append("Error while querying Pedigree_Tree_Test table: " + str(e))

    # test that we can add entries to the Pedigree_Patient_Test table
    try:
        patient = models.Pedigree_Patient_Test(name="Test Patient", dob=datetime.date(2000, 1, 1), ethnicity="Test Ethnicity")
        db.session.add(patient)
        db.session.commit()
    except Exception as e:
        errors.append("Error while adding entries to Pedigree_Patient_Test table: " + str(e))

    # test that the entry in the Pedigree_Patient_Test table has the correct information
    try:
        patient_query = models.Pedigree_Patient_Test.query.first()
        if patient_query.name != "Test Patient":
            errors.append("Query from patient table doesn't have the correct name, instead contains: " + patient_query.name)
        if patient_query.dob != datetime.datetime(2000, 1, 1, 0, 0, 0):
            errors.append("Query from patient table doesn't have the correct DOB, instead contains: " + str(patient_query.dob))
        if patient_query.ethnicity != "Test Ethnicity":
            errors.append("Query from patient table doesn't have the correct ethnicity, instead contains: " + patient_query.ethnicity)
    except Exception as e:
        errors.append("Error while querying Pedigree_Patient_Test table: " + str(e))

    # test that we can add entries to the Pedigree_Health_Condition_Test table
    try:
        health_condition = models.Pedigree_Health_Condition_Test(name="Test Health Condition", hereditary=True)
        db.session.add(health_condition)
        db.session.commit()
    except Exception as e:
        errors.append("Error while adding entries to Pedigree_Health_Condition_Test table: " + str(e))

    # test that the entry in the Pedigree_Health_Condition_Test table has the correct information
    try:
        health_condition_query = models.Pedigree_Health_Condition_Test.query.first()
        if health_condition_query.name != "Test Health Condition":
            errors.append("Query from health_condition table doesn't have the correct name, instead contains: " + health_condition_query.name)
        if health_condition_query.hereditary is not True:
            errors.append("Query from health_condition table doesn't have the correct boolean value, instead contains: " + health_condition_query.dob)
    except Exception as e:
        errors.append("Error while querying Pedigree_Health_Condition_Test table: " + str(e))

    # test the relationships between tables using their join tables
    # test whether the tree_patient_test table correctly tracks the "nodes" relationship
    try:
        tree.nodes.append(patient)
        db.session.commit()
        if not tree.nodes[0] == patient:
            errors.append("tree.nodes does not include the correct patient, instead contains: " + str(tree.nodes[0]))
        if not patient.node_of[0] == tree:
            errors.append("patient.node_of does not include the correct tree, instead contains: " + str(patient.node_of[0]))
    except Exception as e:
        errors.append("Error while testing tree_patient_test table : " + str(e))

    # test whether the parent_child_test table correctly tracks the "children" relationship
    try:
        # add a new patient to act as a child
        child = models.Pedigree_Patient_Test(name="Test Child", dob=datetime.date(2010, 1, 1), ethnicity="Test Ethnicity")
        patient.children.append(child)
        db.session.commit()
        if not patient.children[0] == child:
            errors.append("patient.children does not include the correct child, instead contains: " + str(patient.children[0]))
        if not child.parents[0] == patient:
            errors.append("child.child_of does not include the correct parent, instead contains: " + str(child.parents[0]))
    except Exception as e:
        errors.append("Error while testing parent_child_test table : " + str(e))

    # test whether the patient_condition_test table correctly tracks the "conditions" relationship
    try:
        patient.conditions.append(health_condition)
        db.session.commit()
        if not patient.conditions[0] == health_condition:
            errors.append("patient.conditions does not contain the correct health condition, instead contains: " + str(patient.conditions[0]))
        if not health_condition.condition_of[0] == patient:
            errors.append("health_condition.condition_of does not contain the correct patient, instead contains: " +
                          str(health_condition.condition_of[0]))
    except Exception as e:
        errors.append("Error while testing patient_condition_test table: " + str(e))

    # test the removal of entries from the three family pedigree databases
    # test removing entries from the Pedigree_Tree_Test database
    try:
        db.session.delete(tree)
        db.session.commit()
        tree_query = db.session.query(models.Pedigree_Tree_Test).first()
        if tree_query is not None:
            errors.append("Entry not removed from Pedigree_Tree_Test, instead contains: " + str(tree_query))
    except Exception as e:
        errors.append("Error while removing from Pedigree_Tree_Test: " + str(e))

    # test removing entries from the Pedigree_Patient_Test database
    try:
        db.session.delete(patient)
        db.session.delete(child)
        db.session.commit()
        patient_query = db.session.query(models.Pedigree_Patient_Test).first()
        if patient_query is not None:
            errors.append("Entry not removed from Pedigree_Patient_Test, instead contains: " + str(patient_query))
    except Exception as e:
        errors.append("Error while removing from Pedigree_Patient_Test: " + str(e))

    # test removing entries from the Pedigree_Health_Condition_Test database
    try:
        db.session.delete(health_condition)
        db.session.commit()
        health_condition_query = db.session.query(models.Pedigree_Health_Condition_Test).first()
        if health_condition_query is not None:
            errors.append("Entry not removed from Pedigree_Health_Condition_Test, instead contains: " + str(health_condition_query))
    except Exception as e:
        errors.append("Error while removing from Pedigree_Health_Condition_Test: " + str(e))

    # test dropping the tables
    try:
        db.drop_all('canopy_test')
    except Exception as e:
        errors.append("Error while dropping canopy_test tables: " + str(e))

    # after all tests print errors if it contains ANY elements
    if len(errors) > 0:
        print()
        i = 1
        for error in errors:
            print(str(i) + ". " + str(error))
            i += 1

    assert len(errors) == 0
