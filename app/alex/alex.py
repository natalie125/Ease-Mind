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

#############################################################
# Routes for serving requests that query about relationships between database entries
# ^^^^^^^^^^^^^^^^^^^^^^^
# function for getting nodes of a tree
@app.route('/canopy/tree_nodes/<string:mode>', methods=['GET'])
def get_tree_nodes(mode):
    tree_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        tree = models.Pedigree_Tree_Test.query.filter_by(id=tree_id).first()
        if tree != None:
            return "tree.nodes: " + str(tree.nodes) + "\ntree_id: " + tree_id
        else:
            return "error, tree not found at tree_id: " + tree_id
    # we are in production mode
    else:
        tree = models.Pedigree_Tree.query.filter_by(id=tree_id).first()
        if tree != None:
            return "tree.nodes: " + str(tree.nodes) + "\ntree_id: " + tree_id
        else:
            return "error, tree not found at tree_id: " + tree_id

# function for getting trees of a patient
@app.route('/canopy/patient_trees/<string:mode>', methods=['GET'])
def get_patient_trees(mode):
    patient_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            return "patient.node_of: " + str(patient.node_of) + "\npatient_id: " + patient_id
        else:
            return "error, patient not found at patient_id: " + patient_id
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if patient != None:
            return "patient.node_of: " + str(patient.node_of) + "\npatient_id: " + patient_id
        else:
            return "error, patient not found at patient_id: " + patient_id

# function for getting children of a parent
@app.route('/canopy/parent_children/<string:mode>', methods=['GET'])
def get_parent_children(mode):
    patient_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            return "patient.children: " + str(patient.children) + "\npatient_id: " + patient_id
        else:
            return "error, patient not found at patient_id: " + patient_id
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if patient != None:
            return "patient.children: " + str(patient.children) + "\npatient_id: " + patient_id
        else:
            return "error, patient not found at patient_id: " + patient_id

# function for getting parents of a child
@app.route('/canopy/child_parents/<string:mode>', methods=['GET'])
def get_child_parents(mode):
    patient_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            return "patient.parents: " + str(patient.parents) + "\npatient_id: " + patient_id
        else:
            return "error, patient not found at patient_id: " + patient_id
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if patient != None:
            return "patient.parents: " + str(patient.parents) + "\npatient_id: " + patient_id
        else:
            return "error, patient not found at patient_id: " + patient_id

# function for getting conditions of a patient
@app.route('/canopy/patient_conditions/<string:mode>', methods=['GET'])
def get_patient_conditions(mode):
    patient_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            return "patient.conditions: " + str(patient.conditions) + "\npatient_id: " + patient_id
        else:
            return "error, patient not found at patient_id: " + patient_id
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if patient != None:
            return "patient.conditions: " + str(patient.conditions) + "\npatient_id: " + patient_id
        else:
            return "error, patient not found at patient_id: " + patient_id

# function for getting patients with a condition
@app.route('/canopy/condition_patients/<string:mode>', methods=['GET'])
def get_condition_patients(mode):
    condition_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        condition = models.Pedigree_Health_Condition_Test.query.filter_by(id=condition_id).first()
        if condition != None:
            return "condition.condition_of: " + str(condition.condition_of) + "\ncondition_id: " + condition_id
        else:
            return "error, condition not found at condition_id: " + condition_id
    # we are in production mode
    else:
        condition = models.Pedigree_Health_Condition.query.filter_by(id=condition_id).first()
        if condition != None:
            return "condition.condition_of: " + str(condition.condition_of) + "\ncondition_id: " + condition_id
        else:
            return "error, condition not found at condition_id: " + condition_id

# function for linking a tree and a patient
@app.route('/canopy/tree_patient/<string:mode>', methods=['PUT'])
def link_tree_patient(mode):
    tree_id = request.args.get('tree_id')
    patient_id = request.args.get('patient_id')

    # check for testing mode
    if mode == "test":
        tree = models.Pedigree_Tree_Test.query.filter_by(id=tree_id).first()
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        tree.nodes.append(patient)
        db.session.commit()
        return "tree.nodes: " + str(tree.nodes) + "\ntree_id: " + tree_id + "\npatient_id: " + patient_id
    # we are in production mode
    else:
        tree = models.Pedigree_Tree.query.filter_by(id=tree_id).first()
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        tree.nodes.append(patient)
        db.session.commit()
        return "tree.nodes: " + str(tree.nodes) + "\ntree_id: " + tree_id + "\npatient_id: " + patient_id

# function for linking a parent and child
@app.route('/canopy/parent_child/<string:mode>', methods=['PUT'])
def link_parent_child(mode):
    parent_id = request.args.get('parent_id')
    child_id = request.args.get('child_id')

    # check for testing mode
    if mode == "test":
        parent = models.Pedigree_Patient_Test.query.filter_by(id=parent_id).first()
        child = models.Pedigree_Patient_Test.query.filter_by(id=child_id).first()
        parent.children.append(child)
        db.session.commit()
        return "parent.children: " + str(parent.children) + "\nparent_id: " + parent_id + "\nchild_id: " + child_id
    # we are in production mode
    else:
        parent = models.Pedigree_Patient.query.filter_by(id=parent_id).first()
        child = models.Pedigree_Patient.query.filter_by(id=child_id).first()
        parent.children.append(child)
        db.session.commit()
        return "parent.children: " + str(parent.children) + "\nparent_id: " + parent_id + "\nchild_id: " + child_id

# function for linking a patient and a health condition
@app.route('/canopy/patient_condition/<string:mode>', methods=['PUT'])
def link_patient_condition(mode):
    patient_id = request.args.get('patient_id')
    condition_id = request.args.get('condition_id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        condition = models.Pedigree_Health_Condition_Test.query.filter_by(id=condition_id).first()
        patient.conditions.append(condition)
        db.session.commit()
        return "patient.conditions: " + str(patient.conditions) + "\npatient_id: " + patient_id + "\ncondition_id: " + condition_id
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        condition = models.Pedigree_Health_Condition.query.filter_by(id=condition_id).first()
        patient.conditions.append(condition)
        db.session.commit()
        return "patient.conditions: " + str(patient.conditions) + "\npatient_id: " + patient_id + "\ncondition_id: " + condition_id