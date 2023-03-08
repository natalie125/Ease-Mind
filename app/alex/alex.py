from flask import Flask, render_template, Response, request, flash, redirect, url_for, session, jsonify
from app import app, models, bcrypt, db
from datetime import datetime

#############################################################
# Routes to pull information from outside the canopy app
# ^^^^^^^^^^^^^^^^^^^^^^^
@app.route('/owner', methods=['GET'])
def get_owner():
    if request.method == 'GET':

        return

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
    if id == "":
        id = None
    name = request.args.get('name')
    if name == "":
        name = None
    owner = request.args.get('owner')
    if owner == "":
        owner = None
    new_name = request.args.get('new_name')
    if new_name == "":
        new_name = None
    new_owner = request.args.get('new_owner')
    if new_owner == "":
        new_owner = None

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
            query_parameters = {
                'ids': [],
                'names': [],
                'owners': []
            }
            for query in tree_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('owners').append(query.owner)
            return jsonify(query_parameters)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None and owner != None:
                new_tree = models.Pedigree_Tree_Test(name=name, owner=owner)
                db.session.add(new_tree)
                db.session.commit()
                return str(new_tree) + "\nid= " + str(new_tree.id) + "\nname= " + str(new_tree.name) + "\nowner= " + str(new_tree.owner)
            else:
                return "Not enough information provided to create a new tree" + "\nid= " + str(id) + "\nname= " + str(name) + "\nowner= " + str(owner)
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
            query_parameters = {
                'ids': [],
                'names': [],
                'owners': []
            }
            for query in tree_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('owners').append(query.owner)
            return jsonify(query_parameters)
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
    if id == "":
        id = None
    name = request.args.get('name')
    if name == "":
        name = None
    dob = request.args.get('dob')
    if dob == "":
        dob = None
    elif dob != None:
        try:
            dob = datetime.strptime(dob, '%Y-%m-%d')
        except Exception as e:
            return str(e)
    ethnicity = request.args.get('ethnicity')
    if ethnicity == "":
        ethnicity = None
    new_name = request.args.get('new_name')
    if new_name == "":
        new_name = None
    new_dob = request.args.get('new_dob')
    if new_dob == "":
        new_dob = None
    elif new_dob != None:
        try:
            new_dob = datetime.strptime(new_dob, '%Y-%m-%d')
        except Exception as e:
            return str(e)
    new_ethnicity = request.args.get('new_ethnicity')
    if new_ethnicity == "":
        new_ethnicity = None
    tree_id = request.args.get('tree_id')
    if tree_id == "":
        tree_id = None

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
            query_parameters = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for query in patient_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('dobs').append(str(query.dob.date()))
                query_parameters.get('ethnicities').append(query.ethnicity)
            return jsonify(query_parameters)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None and ethnicity != None:
                new_patient = models.Pedigree_Patient_Test(name=name, dob=dob, ethnicity=ethnicity)
                db.session.add(new_patient)
                if tree_id != None:
                    tree = models.Pedigree_Tree_Test.query.filter_by(id=tree_id).first()
                    tree.nodes.append(new_patient)
                db.session.commit()
                return str(new_patient.id)
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
            query_parameters = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for query in patient_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('dobs').append(str(query.dob.date()))
                query_parameters.get('ethnicities').append(query.ethnicity)
            return jsonify(query_parameters)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None and ethnicity != None:
                new_patient = models.Pedigree_Patient(name=name, dob=dob, ethnicity=ethnicity)
                db.session.add(new_patient)
                if tree_id != None:
                    tree = models.Pedigree_Tree.query.filter_by(id=tree_id).first()
                    tree.nodes.append(new_patient)
                db.session.commit()
                return str(new_patient.id)
            else:
                return "Not enough information provided to create a new patient" + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(ethnicity)
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
                return "id= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\nethnicity= " + str(ethnicity)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
    return "error, not enough information given in HTTP request"

# function for querying the health condition database
@app.route('/canopy/condition/<string:mode>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def query_condition(mode):
    # read in the query string for parameters
    id = request.args.get('id')
    if id == "":
        id = None
    name = request.args.get('name')
    if name == "":
        name = None
    hereditary = request.args.get('hereditary')
    if hereditary == "":
        hereditary = None
    if hereditary != None:
        hereditary = eval(request.args.get('hereditary').capitalize())
    new_name = request.args.get('new_name')
    if new_name == "":
        new_name = None
    new_hereditary = request.args.get('new_hereditary')
    if new_hereditary == "":
        new_hereditary = None
    if new_hereditary != None:
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
            query_parameters = {
                'ids': [],
                'names': [],
                'hereditarys': []
            }
            for query in condition_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('hereditarys').append(query.hereditary)
            return jsonify(query_parameters)
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
            query_parameters = {
                'ids': [],
                'names': [],
                'hereditarys': []
            }
            for query in condition_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('hereditarys').append(query.hereditary)
            return jsonify(query_parameters)
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
            nodes_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for node in tree.nodes:
                nodes_json.get('ids').append(node.id)
                nodes_json.get('names').append(node.name)
                nodes_json.get('dobs').append(str(node.dob.date()))
                nodes_json.get('ethnicities').append(node.ethnicity)
            return jsonify(nodes_json)
        else:
            return "error, tree not found at tree_id: " + str(tree_id)
    # we are in production mode
    else:
        tree = models.Pedigree_Tree.query.filter_by(id=tree_id).first()
        if tree != None:
            nodes_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for node in tree.nodes:
                nodes_json.get('ids').append(node.id)
                nodes_json.get('names').append(node.name)
                nodes_json.get('dobs').append(str(node.dob.date()))
                nodes_json.get('ethnicities').append(node.ethnicity)
            return jsonify(nodes_json)
        else:
            return "error, tree not found at tree_id: " + str(tree_id)

# function for getting trees of a patient
@app.route('/canopy/patient_trees/<string:mode>', methods=['GET'])
def get_patient_trees(mode):
    patient_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            node_of_json = {
                'ids': [],
                'names': [],
                'owners': []
            }
            if patient.node_of != None:
                for tree in patient.node_of:
                    node_of_json.get('ids').append(tree.id)
                    node_of_json.get('names').append(tree.name)
                    node_of_json.get('owners').append(tree.owner)
                return jsonify(node_of_json)
            else:
                return "error, patient not part of any trees: " + str(patient_id)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if patient != None:
            node_of_json = {
                'ids': [],
                'names': [],
                'owners': []
            }
            if patient.node_of != None:
                for tree in patient.node_of:
                    node_of_json.get('ids').append(tree.id)
                    node_of_json.get('names').append(tree.name)
                    node_of_json.get('owners').append(tree.owner)
                return jsonify(node_of_json)
            else:
                return "error, patient not part of any trees: " + str(patient_id)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)

# function for getting children of a parent
@app.route('/canopy/parent_children/<string:mode>', methods=['GET'])
def get_parent_children(mode):
    patient_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            children_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for child in patient.children:
                children_json.get('ids').append(child.id)
                children_json.get('names').append(child.name)
                children_json.get('dobs').append(str(child.dob.date()))
                children_json.get('ethnicities').append(child.ethnicity)
            return jsonify(children_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if patient != None:
            children_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for child in patient.children:
                children_json.get('ids').append(child.id)
                children_json.get('names').append(child.name)
                children_json.get('dobs').append(str(child.dob.date()))
                children_json.get('ethnicities').append(child.ethnicity)
            return jsonify(children_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)

# function for getting parents of a child
@app.route('/canopy/child_parents/<string:mode>', methods=['GET'])
def get_child_parents(mode):
    patient_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            parents_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for parent in patient.parents:
                parents_json.get('ids').append(parent.id)
                parents_json.get('names').append(parent.name)
                parents_json.get('dobs').append(str(parent.dob.date()))
                parents_json.get('ethnicities').append(parent.ethnicity)
            return jsonify(parents_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if patient != None:
            parents_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for parent in patient.parents:
                parents_json.get('ids').append(parent.id)
                parents_json.get('names').append(parent.name)
                parents_json.get('dobs').append(str(parent.dob.date()))
                parents_json.get('ethnicities').append(parent.ethnicity)
            return jsonify(parents_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)

# function for getting conditions of a patient
@app.route('/canopy/patient_conditions/<string:mode>', methods=['GET'])
def get_patient_conditions(mode):
    patient_id = request.args.get('id')
    if patient_id == "":
        patient_id = None

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            conditions_json = {
                'ids': [],
                'names': [],
                'hereditarys': []
            }
            for condition in patient.conditions:
                conditions_json.get('ids').append(condition.id)
                conditions_json.get('names').append(condition.name)
                conditions_json.get('hereditarys').append(condition.hereditary)
            return jsonify(conditions_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if patient != None:
            conditions_json = {
                'ids': [],
                'names': [],
                'hereditarys': []
            }
            for condition in patient.conditions:
                conditions_json.get('ids').append(condition.id)
                conditions_json.get('names').append(condition.name)
                conditions_json.get('hereditarys').append(condition.hereditary)
            return jsonify(conditions_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)

# function for getting patients with a condition
@app.route('/canopy/condition_patients/<string:mode>', methods=['GET'])
def get_condition_patients(mode):
    condition_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        condition = models.Pedigree_Health_Condition_Test.query.filter_by(id=condition_id).first()
        if condition != None:
            condition_of_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for patient in condition.condition_of:
                condition_of_json.get('ids').append(patient.id)
                condition_of_json.get('names').append(patient.name)
                condition_of_json.get('dobs').append(str(patient.dob.date()))
                condition_of_json.get('ethnicities').append(patient.ethnicity)
            return jsonify(condition_of_json)
        else:
            return "error, condition not found at condition_id: " + str(condition_id)
    # we are in production mode
    else:
        condition = models.Pedigree_Health_Condition.query.filter_by(id=condition_id).first()
        if condition != None:
            condition_of_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'ethnicities': []
            }
            for patient in condition.condition_of:
                condition_of_json.get('ids').append(patient.id)
                condition_of_json.get('names').append(patient.name)
                condition_of_json.get('dobs').append(str(patient.dob.date()))
                condition_of_json.get('ethnicities').append(patient.ethnicity)
            return jsonify(condition_of_json)
        else:
            return "error, condition not found at condition_id: " + str(condition_id)

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
    request_data = request.get_json()
    patient_id = request_data['patient_id']
    if patient_id == "":
        patient_id = None
    parents = request_data['parents']  # in the form of an array of dictionaries like { id: 2, label: "patient 2" }
    if parents == "" or parents == []:
        parents = None
    children = request_data['children']  # in the form of an array of dictionaries like { id: 2, label: "patient 2" }
    if children == "" or children == []:
        children = None
    clear_parents = request_data['clear_parents']
    if clear_parents == "":
        clear_parents = None
    clear_children = request_data['clear_children']
    if clear_children == "":
        clear_children = None
    parent_id = request_data['parent_id']
    if parent_id == "":
        parent_id = None
    child_id = request_data['child_id']
    if child_id == "":
        child_id = None

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        # clear arrays
        if clear_parents:
            patient.parents = []
        if clear_children:
            patient.children = []
        # if singleton IDs were provided
        if parent_id != None and child_id != None:
            parent = models.Pedigree_Patient_Test.query.filter_by(id=parent_id).first()
            child = models.Pedigree_Patient_Test.query.filter_by(id=child_id).first()
            parent.children.append(child)
        # if array of parents and children are to be used
        if parents != None:
            for parent_entry in parents:
                parent_query = models.Pedigree_Patient_Test.query.filter_by(id=parent_entry.get("id")).first()
                patient.parents.append(parent_query)
        if children != None:
            for child_entry in children:
                child_query = models.Pedigree_Patient_Test.query.filter_by(id=child_entry.get("id")).first()
                patient.children.append(child_query)
        db.session.commit()

        return "patient.children: " + str(patient.children) + "\nparent_id: " + str(parent_id) + "\nchild_id: " + str(
            child_id) + "\nparents: " + str(parents) + "\nchildren: " + str(children) + "\nclear_parents: " + str(
            clear_parents) + "\nclear_children: " + str(clear_children)
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        # clear arrays
        if clear_parents:
            patient.parents = []
        if clear_children:
            patient.children = []
        # if singleton IDs were provided
        if parent_id != None and child_id != None:
            parent = models.Pedigree_Patient.query.filter_by(id=parent_id).first()
            child = models.Pedigree_Patient.query.filter_by(id=child_id).first()
            parent.children.append(child)
        # if array of parents and children are to be used
        if parents != None:
            for parent_entry in parents:
                parent_query = models.Pedigree_Patient.query.filter_by(id=parent_entry.get("id")).first()
                patient.parents.append(parent_query)
        if children != None:
            for child_entry in children:
                child_query = models.Pedigree_Patient.query.filter_by(id=child_entry.get("id")).first()
                patient.children.append(child_query)
        db.session.commit()

        return "patient.children: " + str(patient.children) + "\nparent_id: " + str(parent_id) + "\nchild_id: " + str(
            child_id) + "\nparents: " + str(parents) + "\nchildren: " + str(children) + "\nclear_parents: " + str(
            clear_parents) + "\nclear_children: " + str(clear_children)

# function for linking a patient and a health condition
@app.route('/canopy/patient_condition/<string:mode>', methods=['PUT'])
def link_patient_condition(mode):
    request_data = request.get_json()
    patient_id = request_data['patient_id']
    if patient_id == "":
        patient_id = None
    condition_id = request_data['condition_id']
    if condition_id == "":
        condition_id = None
    conditions = request_data['conditions'] # in the form of an array of dictionaries like { id: 2, label: "condition 2" }
    if conditions == "" or conditions == []:
        conditions = None
    clear_conditions = request_data['clear_conditions']
    if clear_conditions == "":
        clear_conditions = None

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if clear_conditions:
            patient.conditions = []
        if condition_id != None:
            condition = models.Pedigree_Health_Condition_Test.query.filter_by(id=condition_id).first()
            patient.conditions.append(condition)
        if conditions != None:
            for condition in conditions:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(id=condition.get("id")).first()
                patient.conditions.append(condition_query)
        db.session.commit()
        return "patient.conditions: " + str(patient.conditions) + "\npatient_id: " + str(patient_id) + "\ncondition_id: " + str(condition_id) + "\nconditions: " + str(conditions) + "\nclear_conditions: " + str(clear_conditions)
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if clear_conditions:
            patient.conditions = []
        if condition_id != None:
            condition = models.Pedigree_Health_Condition.query.filter_by(id=condition_id).first()
            patient.conditions.append(condition)
        if conditions != None:
            for condition in conditions:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(id=condition.get("id")).first()
                patient.conditions.append(condition_query)
        db.session.commit()
        return "patient.conditions: " + str(patient.conditions) + "\npatient_id: " + str(patient_id) + "\ncondition_id: " + str(condition_id) + "\nconditions: " + str(conditions) + "\nclear_conditions: " + str(clear_conditions)