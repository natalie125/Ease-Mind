from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db
from datetime import datetime


#############################################################
# Routes for pages to display to users of the Canopy app (family pedigree)
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/canopy', methods=['GET', 'POST'])
def canopy_home():
    if request.method == 'GET' or request.method == 'POST':
        return "Alex's App Requested (Canopy)"


#############################################################
# Routes for serving requests that query from the database
# ^^^^^^^^^^^^^^^^^^^^^^^
# function for querying the tree database
@app.route('/canopy/tree/<string:mode>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def query_tree(mode):
    # read in the query string for parameters
    id = request.args.get('id')
    name = request.args.get('name')
    owner = request.args.get('owner')
    new_name = request.args.get('new_name')
    new_owner = request.args.get('new_owner')

    # testing mode, bind to canopy test databases
    if mode == "test":
        # GET a tree entry
        if request.method == 'GET':
            # check using the correct combination of parameters
            if id != None and name != None and owner != None:
                tree_query = models.Pedigree_Tree_Test.query.filter_by(id=id, name=name, owner=owner).all()
            elif id == None and name != None and owner != None:
                tree_query = models.Pedigree_Tree_Test.query.filter_by(name=name, owner=owner).all()
            elif id != None and name == None and owner != None:
                tree_query = models.Pedigree_Tree_Test.query.filter_by(id=id, owner=owner).all()
            elif id != None and name != None and owner == None:
                tree_query = models.Pedigree_Tree_Test.query.filter_by(id=id, name=name).all()
            elif id == None and name == None and owner != None:
                tree_query = models.Pedigree_Tree_Test.query.filter_by(owner=owner).all()
            elif id != None and name == None and owner == None:
                tree_query = models.Pedigree_Tree_Test.query.filter_by(id=id).all()
            elif id == None and name != None and owner == None:
                tree_query = models.Pedigree_Tree_Test.query.filter_by(name=name).all()
            elif id == None and name == None and owner == None:
                tree_query = models.Pedigree_Tree_Test.query.all()
            return str(tree_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\nowner= " + str(owner)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None and owner != None:
                new_tree = models.Pedigree_Tree_Test(name=name, owner=owner)
                db.session.add(new_tree)
                db.session.commit()
                return str(new_tree) + "\nid= " + str(new_tree.id) + "\nname= " + str(
                    new_tree.name) + "\nowner= " + str(new_tree.owner)
            else:
                return "Not enough information provided to create a new tree" + "\nid= " + str(id) + "\nname= " + str(
                    name) + "\nowner= " + str(owner)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                tree_query = models.Pedigree_Tree_Test.query.filter_by(id=id).first()
                if new_name != None:
                    tree_query.name = new_name
                if new_owner != None:
                    tree_query.owner = new_owner
                db.session.commit()
                return str(tree_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\nowner= " + str(owner)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the tree's id as name and owner are not unique
            if id != None:
                models.Pedigree_Tree_Test.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + "\nname= " + str(name) + "\nowner= " + str(owner)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
    # production mode, bind to actual canopy databases
    else:
        # GET a tree entry
        if request.method == 'GET':
            # check using the correct combination of parameters
            if id != None and name != None and owner != None:
                tree_query = models.Pedigree_Tree.query.filter_by(id=id, name=name, owner=owner).all()
            elif id == None and name != None and owner != None:
                tree_query = models.Pedigree_Tree.query.filter_by(name=name, owner=owner).all()
            elif id != None and name == None and owner != None:
                tree_query = models.Pedigree_Tree.query.filter_by(id=id, owner=owner).all()
            elif id != None and name != None and owner == None:
                tree_query = models.Pedigree_Tree.query.filter_by(id=id, name=name).all()
            elif id == None and name == None and owner != None:
                tree_query = models.Pedigree_Tree.query.filter_by(owner=owner).all()
            elif id != None and name == None and owner == None:
                tree_query = models.Pedigree_Tree.query.filter_by(id=id).all()
            elif id == None and name != None and owner == None:
                tree_query = models.Pedigree_Tree.query.filter_by(name=name).all()
            elif id == None and name == None and owner == None:
                tree_query = models.Pedigree_Tree.query.all()
            return str(tree_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\nowner= " + str(owner)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None and owner != None:
                new_tree = models.Pedigree_Tree(name=name, owner=owner)
                db.session.add(new_tree)
                db.session.commit()
                return str(new_tree) + "\nid= " + str(new_tree.id) + "\nname= " + str(new_tree.name) + "\nowner= " + str(new_tree.owner)
            else:
                return "Not enough information provided to create a new tree" + "\nid= " + str(id) + "\nname= " + str(name) + "\nowner= " + str(owner)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                tree_query = models.Pedigree_Tree.query.filter_by(id=id).first()
                if new_name != None:
                    tree_query.name = new_name
                if new_owner != None:
                    tree_query.owner = new_owner
                db.session.commit()
                return str(tree_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\nowner= " + str(owner)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the tree's id as name and owner are not unique
            if id != None:
                models.Pedigree_Tree.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + "\nname= " + str(name) + "\nowner= " + str(owner)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
    return "error, not enough information given in HTTP request"

# function for querying the patient database
@app.route('/canopy/patient/<string:mode>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def query_patient(mode):
    # read in the query string for parameters
    id = request.args.get('id')
    name = request.args.get('name')
    dob = datetime.strptime(request.args.get('dob'), '%Y-%m-%d')
    ethnicity = request.args.get('ethnicity')
    new_name = request.args.get('new_name')
    new_dob = datetime.strptime(request.args.get('new_dob'), '%Y-%m-%d')
    new_ethnicity = request.args.get('new_ethnicity')

    # testing mode, bind to canopy test databases
    if mode == "test":
        # GET a tree entry
        if request.method == 'GET':
            # check using the correct combination of parameters
            if id != None and name != None and dob != None and ethnicity != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id, name=name, dob=dob, ethnicity=ethnicity).all()
            elif id == None and name != None and dob != None and ethnicity != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(name=name, dob=dob, ethnicity=ethnicity).all()
            elif id != None and name == None and dob != None and ethnicity != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id, dob=dob, ethnicity=ethnicity).all()
            elif id != None and name != None and dob == None and ethnicity != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id, name=name, ethnicity=ethnicity).all()
            elif id != None and name != None and dob != None and ethnicity == None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id, name=name, dob=dob).all()
            elif id == None and name == None and dob != None and ethnicity != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(dob=dob, ethnicity=ethnicity).all()
            elif id != None and name == None and dob == None and ethnicity != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id, ethnicity=ethnicity).all()
            elif id != None and name != None and dob == None and ethnicity == None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id, name=name).all()
            elif id == None and name != None and dob == None and ethnicity != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(name=name, ethnicity=ethnicity).all()
            elif id != None and name == None and dob != None and ethnicity == None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id, dob=dob).all()
            elif id == None and name != None and dob != None and ethnicity == None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(name=name, dob=dob).all()
            elif id == None and name == None and dob == None and ethnicity != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(ethnicity=ethnicity).all()
            elif id != None and name == None and dob == None and ethnicity == None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id).all()
            elif id == None and name != None and dob == None and ethnicity == None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(name=name).all()
            elif id == None and name == None and dob != None and ethnicity == None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(dob=dob).all()
            elif id == None and name == None and dob == None and ethnicity == None:
                patient_query = models.Pedigree_Patient_Test.query.all()
            return str(patient_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(ethnicity)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None and ethnicity != None:
                new_patient = models.Pedigree_Patient_Test(name=name, dob=dob, ethnicity=ethnicity)
                db.session.add(new_patient)
                db.session.commit()
                return str(new_patient) + "\nid= " + str(new_patient.id) + "\nname= " + str(new_patient.name) + "\ndob= " + str(new_patient.dob) + "\nethnicity= " + str(ethnicity)
            else:
                return "Not enough information provided to create a new patient" + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(ethnicity)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id).first()
                if new_name != None:
                    patient_query.name = new_name
                if new_dob != None:
                    patient_query.dob = new_dob
                if new_ethnicity != None:
                    patient_query.ethnicity = new_ethnicity
                db.session.commit()
                return str(patient_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(ethnicity)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the tree's id as name and owner are not unique
            if id != None:
                models.Pedigree_Patient_Test.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(ethnicity)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
    # production mode, bind to actual canopy databases
    else:
        # GET a tree entry
        if request.method == 'GET':
            # check using the correct combination of parameters
            if id != None and name != None and dob != None and ethnicity != None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id, name=name, dob=dob, ethnicity=ethnicity).all()
            elif id == None and name != None and dob != None and ethnicity != None:
                patient_query = models.Pedigree_Patient.query.filter_by(name=name, dob=dob, ethnicity=ethnicity).all()
            elif id != None and name == None and dob != None and ethnicity != None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id, dob=dob, ethnicity=ethnicity).all()
            elif id != None and name != None and dob == None and ethnicity != None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id, name=name, ethnicity=ethnicity).all()
            elif id != None and name != None and dob != None and ethnicity == None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id, name=name, dob=dob).all()
            elif id == None and name == None and dob != None and ethnicity != None:
                patient_query = models.Pedigree_Patient.query.filter_by(dob=dob, ethnicity=ethnicity).all()
            elif id != None and name == None and dob == None and ethnicity != None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id, ethnicity=ethnicity).all()
            elif id != None and name != None and dob == None and ethnicity == None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id, name=name).all()
            elif id == None and name != None and dob == None and ethnicity != None:
                patient_query = models.Pedigree_Patient.query.filter_by(name=name, ethnicity=ethnicity).all()
            elif id != None and name == None and dob != None and ethnicity == None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id, dob=dob).all()
            elif id == None and name != None and dob != None and ethnicity == None:
                patient_query = models.Pedigree_Patient.query.filter_by(name=name, dob=dob).all()
            elif id == None and name == None and dob == None and ethnicity != None:
                patient_query = models.Pedigree_Patient.query.filter_by(ethnicity=ethnicity).all()
            elif id != None and name == None and dob == None and ethnicity == None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id).all()
            elif id == None and name != None and dob == None and ethnicity == None:
                patient_query = models.Pedigree_Patient.query.filter_by(name=name).all()
            elif id == None and name == None and dob != None and ethnicity == None:
                patient_query = models.Pedigree_Patient.query.filter_by(dob=dob).all()
            elif id == None and name == None and dob == None and ethnicity == None:
                patient_query = models.Pedigree_Patient.query.all()
            return str(patient_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(ethnicity)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None and ethnicity != None:
                new_patient = models.Pedigree_Patient(name=name, dob=dob, ethnicity=ethnicity)
                db.session.add(new_patient)
                db.session.commit()
                return str(new_patient) + "\nid= " + str(new_patient.id) + "\nname= " + str(new_patient.name) + "\ndob= " + str(new_patient.dob) + "\nethnicity= " + str(ethnicity)
            else:
                return "Not enough information provided to create a new patient" + "\nid= " + str(
                    id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(ethnicity)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id).first()
                if new_name != None:
                    patient_query.name = new_name
                if new_dob != None:
                    patient_query.dob = new_dob
                if new_ethnicity != None:
                    patient_query.ethnicity = new_ethnicity
                db.session.commit()
                return str(patient_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(ethnicity)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the tree's id as name and owner are not unique
            if id != None:
                models.Pedigree_Patient.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(
                    ethnicity)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
    return "error, not enough information given in HTTP request"

# function for querying the health condition database
@app.route('/canopy/condition/<string:mode>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def query_condition(mode):
    # read in the query string for parameters
    id = request.args.get('id')
    name = request.args.get('name')
    hereditary = eval(request.args.get('hereditary').capitalize())
    new_name = request.args.get('new_name')
    new_hereditary = eval(request.args.get('new_hereditary').capitalize())

    # testing mode, bind to canopy test databases
    if mode == "test":
        # GET a tree entry
        if request.method == 'GET':
            # check using the correct combination of parameters
            if id != None and name != None and hereditary != None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(id=id, name=name, hereditary=hereditary).all()
            elif id == None and name != None and hereditary != None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(name=name, hereditary=hereditary).all()
            elif id != None and name == None and hereditary != None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(id=id, hereditary=hereditary).all()
            elif id != None and name != None and hereditary == None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(id=id, name=name).all()
            elif id == None and name == None and hereditary != None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(hereditary=hereditary).all()
            elif id != None and name == None and hereditary == None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(id=id).all()
            elif id == None and name != None and hereditary == None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(name=name).all()
            elif id == None and name == None and hereditary == None:
                condition_query = models.Pedigree_Health_Condition_Test.query.all()
            return str(condition_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\nhereditary= " + str(hereditary)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None:
                new_condition = models.Pedigree_Health_Condition_Test(name=name)
                if hereditary != None:
                    new_condition.hereditary = hereditary
                db.session.add(new_condition)
                db.session.commit()
                return str(new_condition) + "\nid= " + str(new_condition.id) + "\nname= " + str(new_condition.name) + "\nhereditary= " + str(new_condition.hereditary)
            else:
                return "Not enough information provided to create a new health condition" + "\nid= " + str(id) + "\nname= " + str(name) + "\nhereditary= " + str(hereditary)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(id=id).first()
                if new_name != None:
                    condition_query.name = new_name
                if new_hereditary != None:
                    condition_query.hereditary = new_hereditary
                db.session.commit()
                return str(condition_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\nhereditary= " + str(hereditary)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the tree's id as name and owner are not unique
            if id != None:
                models.Pedigree_Health_Condition_Test.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + "\nname= " + str(name) + "\nhereditary= " + str(hereditary)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
    # production mode, bind to actual canopy databases
    else:
        # GET a tree entry
        if request.method == 'GET':
            # check using the correct combination of parameters
            if id != None and name != None and hereditary != None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(id=id, name=name, hereditary=hereditary).all()
            elif id == None and name != None and hereditary != None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(name=name, hereditary=hereditary).all()
            elif id != None and name == None and hereditary != None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(id=id, hereditary=hereditary).all()
            elif id != None and name != None and hereditary == None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(id=id, name=name).all()
            elif id == None and name == None and hereditary != None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(hereditary=hereditary).all()
            elif id != None and name == None and hereditary == None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(id=id).all()
            elif id == None and name != None and hereditary == None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(name=name).all()
            elif id == None and name == None and hereditary == None:
                condition_query = models.Pedigree_Health_Condition.query.all()
            return str(condition_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\nhereditary= " + str(hereditary)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None:
                new_condition = models.Pedigree_Health_Condition(name=name)
                if hereditary != None:
                    new_condition.hereditary = hereditary
                db.session.add(new_condition)
                db.session.commit()
                return str(new_condition) + "\nid= " + str(new_condition.id) + "\nname= " + str(new_condition.name) + "\nhereditary= " + str(new_condition.hereditary)
            else:
                return "Not enough information provided to create a new health condition" + "\nid= " + str(id) + "\nname= " + str(name) + "\nhereditary= " + str(hereditary)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(id=id).first()
                if new_name != None:
                    condition_query.name = new_name
                if new_hereditary != None:
                    condition_query.hereditary = new_hereditary
                db.session.commit()
                return str(condition_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\nhereditary= " + str(hereditary)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the tree's id as name and owner are not unique
            if id != None:
                models.Pedigree_Health_Condition.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + "\nname= " + str(name) + "\nhereditary= " + str(hereditary)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
    return "error, not enough information given in HTTP request"