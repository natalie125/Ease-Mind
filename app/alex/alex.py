# flake8: noqa
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
                tree_query = models.Pedigree_Tree_Test.query.filter_by(id=id).first()
                # make sure to clean the relationships of the tree's nodes (conditions, parents, children)
                for node in tree_query.nodes:
                    node.conditions = []
                    node.parents = []
                    node.children = []
                    node.spouses = []
                    node.spouse_of = []
                tree_query.nodes = []
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
                tree_query = models.Pedigree_Tree.query.filter_by(id=id).first()
                # make sure to clean the relationships of the tree's nodes (conditions, parents, children)
                for node in tree_query.nodes:
                    node.conditions = []
                    node.parents = []
                    node.children = []
                    node.spouses = []
                    node.spouse_of = []
                tree_query.nodes = []
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
    dod = request.args.get('dod')
    if dod == "" or dod == "None":
        dod = None
    elif dod != None:
        try:
            dod = datetime.strptime(dod, '%Y-%m-%d')
        except Exception as e:
            return str(e)
    gender = request.args.get('gender')
    if gender == "":
        gender = None
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
    new_dod = request.args.get('new_dod')
    if new_dod == "" or new_dod == "None":
        new_dod = None
    elif new_dod != None:
        try:
            new_dod = datetime.strptime(new_dod, '%Y-%m-%d')
        except Exception as e:
            return str(e)
    new_gender = request.args.get('new_gender')
    if new_gender == "":
        new_gender = None
    new_ethnicity = request.args.get('new_ethnicity')
    if new_ethnicity == "":
        new_ethnicity = None
    tree_id = request.args.get('tree_id')
    if tree_id == "":
        tree_id = None

    # testing mode, bind to canopy test databases
    if mode == "test":
        # GET a patient entry
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for query in patient_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('dobs').append(str(query.dob.date()))
                if(query.dod != None and query.dod != "None"):
                    query_parameters.get('dods').append(str(query.dod.date()))
                else:
                    query_parameters.get('dods').append("None")
                query_parameters.get('genders').append(query.gender)
                query_parameters.get('ethnicities').append(query.ethnicity)
            return jsonify(query_parameters)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None and ethnicity != None:
                new_patient = models.Pedigree_Patient_Test(name=name, dob=dob, dod=dod, gender=gender, ethnicity=ethnicity)
                db.session.add(new_patient)
                if tree_id != None:
                    tree = models.Pedigree_Tree_Test.query.filter_by(id=tree_id).first()
                    tree.nodes.append(new_patient)
                db.session.commit()
                return str(new_patient.id)
            else:
                return "Not enough information provided to create a new patient" + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\ndod " + str(dod) + "\ngender= " + str(gender) + "\nethnicity= " + str(ethnicity)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id).first()
                if new_name != None:
                    patient_query.name = new_name
                if new_dob != None:
                    patient_query.dob = new_dob
                patient_query.dod = new_dod
                if new_gender != None:
                    patient_query.gender = new_gender
                if new_ethnicity != None:
                    patient_query.ethnicity = new_ethnicity
                db.session.commit()
                return str(patient_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\ndod " + str(dod) + "\ngender= " + str(gender) + "\nethnicity= " + str(ethnicity)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the patient's id as name and owner are not unique
            if id != None:
                patient_query = models.Pedigree_Patient_Test.query.filter_by(id=id).first()
                patient_query.parents = []
                patient_query.children = []
                patient_query.conditions = []
                patient_query.node_of = []
                patient_query.spouses = []
                patient_query.spouse_of = []
                models.Pedigree_Patient_Test.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\ndod " + str(dod) + "\ngender= " + str(gender) + "\nethnicity= " + str(ethnicity)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
    # production mode, bind to actual canopy databases
    else:
        # GET a patient entry
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for query in patient_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('dobs').append(str(query.dob.date()))
                if (query.dod != None and query.dod != "None"):
                    query_parameters.get('dods').append(str(query.dod.date()))
                else:
                    query_parameters.get('dods').append("None")
                query_parameters.get('genders').append(query.gender)
                query_parameters.get('ethnicities').append(query.ethnicity)
            return jsonify(query_parameters)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None and ethnicity != None:
                new_patient = models.Pedigree_Patient(name=name, dob=dob, dod=dod, gender=gender, ethnicity=ethnicity)
                db.session.add(new_patient)
                if tree_id != None:
                    tree = models.Pedigree_Tree.query.filter_by(id=tree_id).first()
                    tree.nodes.append(new_patient)
                db.session.commit()
                return str(new_patient.id)
            else:
                return "Not enough information provided to create a new patient" + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(dob) + "\ndod " + str(dod) + "\ngender= " + str(gender) + "\nethnicity= " + str(ethnicity)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id).first()
                if new_name != None:
                    patient_query.name = new_name
                if new_dob != None:
                    patient_query.dob = new_dob
                patient_query.dod = new_dod
                if new_gender != None:
                    patient_query.gender = new_gender
                if new_ethnicity != None:
                    patient_query.ethnicity = new_ethnicity
                db.session.commit()
                return str(patient_query) + "\nid= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(
                    dob) + "\ndod " + str(dod) + "\ngender= " + str(gender) + "\nethnicity= " + str(ethnicity)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the patient's id as name and owner are not unique
            if id != None:
                patient_query = models.Pedigree_Patient.query.filter_by(id=id).first()
                patient_query.parents = []
                patient_query.children = []
                patient_query.conditions = []
                patient_query.node_of = []
                patient_query.spouses = []
                patient_query.spouse_of = []
                models.Pedigree_Patient.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + "\nname= " + str(name) + "\ndob= " + str(
                    dob) + "\ndod " + str(dod) + "\ngender= " + str(gender) + "\nethnicity= " + str(ethnicity)
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
    disease_id = request.args.get('disease_id')
    if disease_id == "":
        disease_id = None
    fh_condition_id = request.args.get('fh_condition_id')
    if fh_condition_id == "":
        fh_condition_id = None
    fh_condition_name = request.args.get('fh_condition_name')
    if fh_condition_name == "":
        fh_condition_name = None
    male_parent = request.args.get('male_parent')
    if male_parent == "":
        male_parent = None
    female_parent = request.args.get('female_parent')
    if female_parent == "":
        female_parent = None
    male_grandparent = request.args.get('male_grandparent')
    if male_grandparent == "":
        male_grandparent = None
    female_grandparent = request.args.get('female_grandparent')
    if female_grandparent == "":
        female_grandparent = None
    new_name = request.args.get('new_name')
    if new_name == "":
        new_name = None
    new_hereditary = request.args.get('new_hereditary')
    if new_hereditary == "":
        new_hereditary = None
    if new_hereditary != None:
        new_hereditary = eval(request.args.get('new_hereditary').capitalize())
    new_disease_id = request.args.get('new_disease_id')
    if new_disease_id == "":
        new_disease_id = None
    new_fh_condition_id = request.args.get('new_fh_condition_id')
    if new_fh_condition_id == "":
        new_fh_condition_id = None
    new_fh_condition_name = request.args.get('new_fh_condition_name')
    if new_fh_condition_name == "":
        new_fh_condition_name = None
    new_male_parent = request.args.get('new_male_parent')
    if new_male_parent == "":
        new_male_parent = None
    new_female_parent = request.args.get('new_female_parent')
    if new_female_parent == "":
        new_female_parent = None
    new_male_grandparent = request.args.get('new_male_grandparent')
    if new_male_grandparent == "":
        new_male_grandparent = None
    new_female_grandparent = request.args.get('new_female_grandparent')
    if new_female_grandparent == "":
        new_female_grandparent = None

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
                'hereditarys': [],
                'disease_ids': [],
                'fh_condition_ids': [],
                'fh_condition_names': [],
                'male_parents': [],
                'female_parents': [],
                'male_grandparents': [],
                'female_grandparents': []
            }
            for query in condition_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('hereditarys').append(query.hereditary)
                query_parameters.get('disease_ids').append(query.disease_id)
                query_parameters.get('fh_condition_ids').append(query.fh_condition_id)
                query_parameters.get('fh_condition_names').append(query.fh_condition_name)
                query_parameters.get('male_parents').append(query.male_parent)
                query_parameters.get('female_parents').append(query.female_parent)
                query_parameters.get('male_grandparents').append(query.male_grandparent)
                query_parameters.get('female_grandparents').append(query.female_grandparent)
            return jsonify(query_parameters)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None:
                new_condition = models.Pedigree_Health_Condition_Test(name=name)
                if hereditary != None:
                    new_condition.hereditary = hereditary
                if disease_id != None:
                    new_condition.disease_id = disease_id
                if fh_condition_id != None:
                    new_condition.fh_condition_id = fh_condition_id
                if fh_condition_name != None:
                    new_condition.fh_condition_name = fh_condition_name
                if male_parent != None:
                    new_condition.male_parent = male_parent
                if female_parent != None:
                    new_condition.female_parent = female_parent
                if male_grandparent != None:
                    new_condition.male_grandparent = male_grandparent
                if female_grandparent != None:
                    new_condition.female_grandparent = female_grandparent
                db.session.add(new_condition)
                db.session.commit()
                return str(new_condition) + \
                       "\nid= " + str(new_condition.id) + \
                       "\nname= " + str(new_condition.name) + \
                       "\nhereditary= " + str(new_condition.hereditary) + \
                       "\ndisease_id= " + str(new_condition.disease_id) + \
                       "\nfh_condition_id= " + str(new_condition.fh_condition_id) + \
                       "\nfh_condition_name= " + str(new_condition.fh_condition_name) + \
                       "\nmale_parent= " + str(new_condition.male_parent) + \
                       "\nfemale_parent= " + str(new_condition.female_parent) + \
                       "\nmale_grandparent= " + str(new_condition.male_grandparent) + \
                       "\nfemale_grandparent= " + str(new_condition.female_grandparent)
            else:
                return "Not enough information provided to create a new health condition" + \
                       "\nid= " + str(id) + \
                       "\nname= " + str(name) + \
                       "\nhereditary= " + str(hereditary) + \
                       "\ndisease_id= " + str(disease_id) + \
                       "\nfh_condition_id= " + str(fh_condition_id) + \
                       "\nfh_condition_name= " + str(fh_condition_name) + \
                       "\nmale_parent= " + str(male_parent) + \
                       "\nfemale_parent= " + str(female_parent) + \
                       "\nmale_grandparent= " + str(male_grandparent) + \
                       "\nfemale_grandparent= " + str(female_grandparent)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(id=id).first()
                if new_name != None:
                    condition_query.name = new_name
                if new_hereditary != None:
                    condition_query.hereditary = new_hereditary
                if new_disease_id != None:
                    condition_query.disease_id = new_disease_id
                if new_fh_condition_id != None:
                    condition_query.fh_condition_id = new_fh_condition_id
                if new_fh_condition_name != None:
                    condition_query.fh_condition_name = new_fh_condition_name
                if new_male_parent != None:
                    condition_query.male_parent = new_male_parent
                if new_female_parent != None:
                    condition_query.female_parent = new_female_parent
                if new_male_grandparent != None:
                    condition_query.male_grandparent = new_male_grandparent
                if new_female_grandparent != None:
                    condition_query.female_grandparent = new_female_grandparent
                db.session.commit()
                return str(condition_query) + \
                       "\nid= " + str(id) + \
                       "\nname= " + str(name) + \
                       "\nhereditary= " + str(hereditary) + \
                       "\ndisease_id= " + str(disease_id) + \
                       "\nfh_condition_id= " + str(fh_condition_id) + \
                       "\nfh_condition_name= " + str(fh_condition_name) + \
                       "\nmale_parent= " + str(male_parent) + \
                       "\nfemale_parent= " + str(female_parent) + \
                       "\nmale_grandparent= " + str(male_grandparent) + \
                       "\nfemale_grandparent= " + str(female_grandparent)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the tree's id as name and owner are not unique
            if id != None:
                condition_query = models.Pedigree_Health_Condition_Test.query.filter_by(id=id).first()
                condition_query.condition_of = []
                models.Pedigree_Health_Condition_Test.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + \
                       "\nname= " + str(name) + \
                       "\nhereditary= " + str(hereditary) + \
                       "\ndisease_id= " + str(disease_id) + \
                       "\nfh_condition_id= " + str(fh_condition_id) + \
                       "\nfh_condition_name= " + str(fh_condition_name) + \
                       "\nmale_parent= " + str(male_parent) + \
                       "\nfemale_parent= " + str(female_parent) + \
                       "\nmale_grandparent= " + str(male_grandparent) + \
                       "\nfemale_grandparent= " + str(female_grandparent)
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
                'hereditarys': [],
                'disease_ids': [],
                'fh_condition_ids': [],
                'fh_condition_names': [],
                'male_parents': [],
                'female_parents': [],
                'male_grandparents': [],
                'female_grandparents': []
            }
            for query in condition_query:
                query_parameters.get('ids').append(query.id)
                query_parameters.get('names').append(query.name)
                query_parameters.get('hereditarys').append(query.hereditary)
                query_parameters.get('disease_ids').append(query.disease_id)
                query_parameters.get('fh_condition_ids').append(query.fh_condition_id)
                query_parameters.get('fh_condition_names').append(query.fh_condition_name)
                query_parameters.get('male_parents').append(query.male_parent)
                query_parameters.get('female_parents').append(query.female_parent)
                query_parameters.get('male_grandparents').append(query.male_grandparent)
                query_parameters.get('female_grandparents').append(query.female_grandparent)
            return jsonify(query_parameters)
        if request.method == 'POST':
            # check using the correct combination of parameters
            if name != None:
                new_condition = models.Pedigree_Health_Condition(name=name)
                if hereditary != None:
                    new_condition.hereditary = hereditary
                if disease_id != None:
                    new_condition.disease_id = disease_id
                if fh_condition_id != None:
                    new_condition.fh_condition_id = fh_condition_id
                if fh_condition_name != None:
                    new_condition.fh_condition_name = fh_condition_name
                if male_parent != None:
                    new_condition.male_parent = male_parent
                if female_parent != None:
                    new_condition.female_parent = female_parent
                if male_grandparent != None:
                    new_condition.male_grandparent = male_grandparent
                if female_grandparent != None:
                    new_condition.female_grandparent = female_grandparent
                db.session.add(new_condition)
                db.session.commit()
                return str(new_condition) + \
                       "\nid= " + str(new_condition.id) + \
                       "\nname= " + str(new_condition.name) + \
                       "\nhereditary= " + str(new_condition.hereditary) + \
                       "\ndisease_id= " + str(new_condition.disease_id) + \
                       "\nfh_condition_id= " + str(new_condition.fh_condition_id) + \
                       "\nfh_condition_name= " + str(new_condition.fh_condition_name) + \
                       "\nmale_parent= " + str(new_condition.male_parent) + \
                       "\nfemale_parent= " + str(new_condition.female_parent) + \
                       "\nmale_grandparent= " + str(new_condition.male_grandparent) + \
                       "\nfemale_grandparent= " + str(new_condition.female_grandparent)
            else:
                return "Not enough information provided to create a new health condition" + \
                       "\nid= " + str(id) + \
                       "\nname= " + str(name) + \
                       "\nhereditary= " + str(hereditary) + \
                       "\ndisease_id= " + str(disease_id) + \
                       "\nfh_condition_id= " + str(fh_condition_id) + \
                       "\nfh_condition_name= " + str(fh_condition_name) + \
                       "\nmale_parent= " + str(male_parent) + \
                       "\nfemale_parent= " + str(female_parent) + \
                       "\nmale_grandparent= " + str(male_grandparent) + \
                       "\nfemale_grandparent= " + str(female_grandparent)
        if request.method == 'PUT':
            # should only be allowed to put using the tree's id as name and owner are not unique
            if id != None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(id=id).first()
                if new_name != None:
                    condition_query.name = new_name
                if new_hereditary != None:
                    condition_query.hereditary = new_hereditary
                if new_disease_id != None:
                    condition_query.disease_id = new_disease_id
                if new_fh_condition_id != None:
                    condition_query.fh_condition_id = new_fh_condition_id
                if new_fh_condition_name != None:
                    condition_query.fh_condition_name = new_fh_condition_name
                if new_male_parent != None:
                    condition_query.male_parent = new_male_parent
                if new_female_parent != None:
                    condition_query.female_parent = new_female_parent
                if new_male_grandparent != None:
                    condition_query.male_grandparent = new_male_grandparent
                if new_female_grandparent != None:
                    condition_query.female_grandparent = new_female_grandparent
                db.session.commit()
                return str(condition_query) + \
                       "\nid= " + str(id) + \
                       "\nname= " + str(name) + \
                       "\nhereditary= " + str(hereditary) + \
                       "\ndisease_id= " + str(disease_id) + \
                       "\nfh_condition_id= " + str(fh_condition_id) + \
                       "\nfh_condition_name= " + str(fh_condition_name) + \
                       "\nmale_parent= " + str(male_parent) + \
                       "\nfemale_parent= " + str(female_parent) + \
                       "\nmale_grandparent= " + str(male_grandparent) + \
                       "\nfemale_grandparent= " + str(female_grandparent)
            else:
                return "Please provide an id value" + "\nid= " + str(id)
        if request.method == 'DELETE':
            # should only be allowed to delete using the condition's id as name and owner are not unique
            if id != None:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(id=id).first()
                condition_query.condition_of = []
                models.Pedigree_Health_Condition.query.filter_by(id=id).delete()
                db.session.commit()
                return "id= " + str(id) + \
                       "\nname= " + str(name) + \
                       "\nhereditary= " + str(hereditary) + \
                       "\ndisease_id= " + str(disease_id) + \
                       "\nfh_condition_id= " + str(fh_condition_id) + \
                       "\nfh_condition_name= " + str(fh_condition_name) + \
                       "\nmale_parent= " + str(male_parent) + \
                       "\nfemale_parent= " + str(female_parent) + \
                       "\nmale_grandparent= " + str(male_grandparent) + \
                       "\nfemale_grandparent= " + str(female_grandparent)
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for node in tree.nodes:
                nodes_json.get('ids').append(node.id)
                nodes_json.get('names').append(node.name)
                nodes_json.get('dobs').append(str(node.dob.date()))
                if (node.dod != None and node.dod != "None"):
                    nodes_json.get('dods').append(str(node.dod.date()))
                else:
                    nodes_json.get('dods').append("None")
                nodes_json.get('genders').append(node.gender)
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for node in tree.nodes:
                nodes_json.get('ids').append(node.id)
                nodes_json.get('names').append(node.name)
                nodes_json.get('dobs').append(str(node.dob.date()))
                if (node.dod != None and node.dod != "None"):
                    nodes_json.get('dods').append(str(node.dod.date()))
                else:
                    nodes_json.get('dods').append("None")
                nodes_json.get('genders').append(node.gender)
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for child in patient.children:
                children_json.get('ids').append(child.id)
                children_json.get('names').append(child.name)
                children_json.get('dobs').append(str(child.dob.date()))
                if (child.dod != None and child.dod != "None"):
                    children_json.get('dods').append(str(child.dod.date()))
                else:
                    children_json.get('dods').append("None")
                children_json.get('genders').append(child.gender)
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for child in patient.children:
                children_json.get('ids').append(child.id)
                children_json.get('names').append(child.name)
                children_json.get('dobs').append(str(child.dob.date()))
                if (child.dod != None and child.dod != "None"):
                    children_json.get('dods').append(str(child.dod.date()))
                else:
                    children_json.get('dods').append("None")
                children_json.get('genders').append(child.gender)
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for parent in patient.parents:
                parents_json.get('ids').append(parent.id)
                parents_json.get('names').append(parent.name)
                parents_json.get('dobs').append(str(parent.dob.date()))
                if (parent.dod != None and parent.dod != "None"):
                    parents_json.get('dods').append(str(parent.dod.date()))
                else:
                    parents_json.get('dods').append("None")
                parents_json.get('genders').append(parent.gender)
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for parent in patient.parents:
                parents_json.get('ids').append(parent.id)
                parents_json.get('names').append(parent.name)
                parents_json.get('dobs').append(str(parent.dob.date()))
                if (parent.dod != None and parent.dod != "None"):
                    parents_json.get('dods').append(str(parent.dod.date()))
                else:
                    parents_json.get('dods').append("None")
                parents_json.get('genders').append(parent.gender)
                parents_json.get('ethnicities').append(parent.ethnicity)
            return jsonify(parents_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)

# function for getting spouses of a patient
@app.route('/canopy/patient_spouses/<string:mode>', methods=['GET'])
def get_patient_spouses(mode):
    patient_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            spouses_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for spouse in patient.spouses:
                spouses_json.get('ids').append(spouse.id)
                spouses_json.get('names').append(spouse.name)
                spouses_json.get('dobs').append(str(spouse.dob.date()))
                if (spouse.dod != None and spouse.dod != "None"):
                    spouses_json.get('dods').append(str(spouse.dod.date()))
                else:
                    spouses_json.get('dods').append("None")
                spouses_json.get('genders').append(spouse.gender)
                spouses_json.get('ethnicities').append(spouse.ethnicity)
            return jsonify(spouses_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        if patient != None:
            spouses_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for spouse in patient.spouses:
                spouses_json.get('ids').append(spouse.id)
                spouses_json.get('names').append(spouse.name)
                spouses_json.get('dobs').append(str(spouse.dob.date()))
                if (spouse.dod != None and spouse.dod != "None"):
                    spouses_json.get('dods').append(str(spouse.dod.date()))
                else:
                    spouses_json.get('dods').append("None")
                spouses_json.get('genders').append(spouse.gender)
                spouses_json.get('ethnicities').append(spouse.ethnicity)
            return jsonify(spouses_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)

# function for getting spouse_ofs a patient
@app.route('/canopy/spouse_of_patients/<string:mode>', methods=['GET'])
def get_spouse_of_patients(mode):
    patient_id = request.args.get('id')

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            patients_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for spouse_of in patient.spouse_of:
                patients_json.get('ids').append(spouse_of.id)
                patients_json.get('names').append(spouse_of.name)
                patients_json.get('dobs').append(str(spouse_of.dob.date()))
                if (patient.dod != None and patient.dod != "None"):
                    patients_json.get('dods').append(str(patient.dod.date()))
                else:
                    patients_json.get('dods').append("None")
                patients_json.get('genders').append(spouse_of.gender)
                patients_json.get('ethnicities').append(spouse_of.ethnicity)
            return jsonify(patients_json)
        else:
            return "error, patient not found at patient_id: " + str(patient_id)
    # we are in production mode
    else:
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        if patient != None:
            patients_json = {
                'ids': [],
                'names': [],
                'dobs': [],
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for spouse_of in patient.spouses:
                patients_json.get('ids').append(spouse_of.id)
                patients_json.get('names').append(spouse_of.name)
                patients_json.get('dobs').append(str(spouse_of.dob.date()))
                if (patient.dod != None and patient.dod != "None"):
                    patients_json.get('dods').append(str(patient.dod.date()))
                else:
                    patients_json.get('dods').append("None")
                patients_json.get('genders').append(spouse_of.gender)
                patients_json.get('ethnicities').append(spouse_of.ethnicity)
            return jsonify(patients_json)
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
                'hereditarys': [],
                'disease_ids': [],
                'fh_condition_ids': [],
                'fh_condition_names': [],
                'male_parents': [],
                'female_parents': [],
                'male_grandparents': [],
                'female_grandparents': []
            }
            for condition in patient.conditions:
                conditions_json.get('ids').append(condition.id)
                conditions_json.get('names').append(condition.name)
                conditions_json.get('hereditarys').append(condition.hereditary)
                conditions_json.get('disease_ids').append(condition.disease_id)
                conditions_json.get('fh_condition_ids').append(condition.fh_condition_id)
                conditions_json.get('fh_condition_names').append(condition.fh_condition_name)
                conditions_json.get('male_parents').append(condition.male_parent)
                conditions_json.get('female_parents').append(condition.female_parent)
                conditions_json.get('male_grandparents').append(condition.male_grandparent)
                conditions_json.get('female_grandparents').append(condition.female_grandparent)
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
                'hereditarys': [],
                'disease_ids': [],
                'fh_condition_ids': [],
                'fh_condition_names': [],
                'male_parents': [],
                'female_parents': [],
                'male_grandparents': [],
                'female_grandparents': []
            }
            for condition in patient.conditions:
                conditions_json.get('ids').append(condition.id)
                conditions_json.get('names').append(condition.name)
                conditions_json.get('hereditarys').append(condition.hereditary)
                conditions_json.get('disease_ids').append(condition.disease_id)
                conditions_json.get('fh_condition_ids').append(condition.fh_condition_id)
                conditions_json.get('fh_condition_names').append(condition.fh_condition_name)
                conditions_json.get('male_parents').append(condition.male_parent)
                conditions_json.get('female_parents').append(condition.female_parent)
                conditions_json.get('male_grandparents').append(condition.male_grandparent)
                conditions_json.get('female_grandparents').append(condition.female_grandparent)
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for patient in condition.condition_of:
                condition_of_json.get('ids').append(patient.id)
                condition_of_json.get('names').append(patient.name)
                condition_of_json.get('dobs').append(str(patient.dob.date()))
                if (patient.dod != None and patient.dod != "None"):
                    condition_of_json.get('dods').append(str(patient.dod.date()))
                else:
                    condition_of_json.get('dods').append("None")
                condition_of_json.get('genders').append(patient.gender)
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
                'dods': [],
                'genders': [],
                'ethnicities': []
            }
            for patient in condition.condition_of:
                condition_of_json.get('ids').append(patient.id)
                condition_of_json.get('names').append(patient.name)
                condition_of_json.get('dobs').append(str(patient.dob.date()))
                if (patient.dod != None and patient.dod != "None"):
                    condition_of_json.get('dods').append(str(patient.dod.date()))
                else:
                    condition_of_json.get('dods').append("None")
                condition_of_json.get('genders').append(patient.gender)
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
        if clear_parents and patient.parents != None:
            patient.parents = []
        if clear_children and patient.children != None:
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

# function for linking a spouse and spouse_of
@app.route('/canopy/patient_spouse/<string:mode>', methods=['PUT'])
def link_patient_spouse(mode):
    request_data = request.get_json()
    patient_id = request_data['patient_id']
    if patient_id == "":
        patient_id = None
    spouses = request_data['spouses']  # in the form of an array of dictionaries like { id: 2, label: "patient 2" }
    if spouses == "" or spouses == []:
        spouses = None
    spouse_of = request_data['spouse_of']  # in the form of an array of dictionaries like { id: 2, label: "patient 2" }
    if spouse_of == "" or spouse_of == []:
        spouse_of = None
    clear_spouses = request_data['clear_spouses']
    if clear_spouses == "":
        clear_spouses = None
    clear_spouse_of = request_data['clear_spouse_of']
    if clear_spouse_of == "":
        clear_spouse_of = None
    spouse_id = request_data['spouse_id']
    if spouse_id == "":
        spouse_id = None
    spouse_of_id = request_data['spouse_of_id']
    if spouse_of_id == "":
        spouse_of_id = None

    # check for testing mode
    if mode == "test":
        patient = models.Pedigree_Patient_Test.query.filter_by(id=patient_id).first()
        # clear arrays
        if clear_spouses and patient.spouses != None:
            patient.spouses = []
        if clear_spouse_of and patient.spouse_of != None:
            patient.spouse_of = []
        # if singleton IDs were provided
        if spouse_id != None and spouse_id != None:
            spouse = models.Pedigree_Patient_Test.query.filter_by(id=spouse_id).first()
            spouse_of = models.Pedigree_Patient_Test.query.filter_by(id=spouse_of_id).first()
            spouse.spouses.append(spouse_of)
        # if array of spouses and spouse_of are to be used
        if spouses != None:
            for spouse_entry in spouses:
                spouse_query = models.Pedigree_Patient_Test.query.filter_by(id=spouse_entry.get("id")).first()
                patient.spouses.append(spouse_query)
                spouse_query.spouses.append(patient)
        if spouse_of != None:
            for spouse_of_entry in spouse_of:
                spouse_of_query = models.Pedigree_Patient_Test.query.filter_by(id=spouse_of_entry.get("id")).first()
                patient.spouse_of.append(spouse_of_query)
                spouse_query.spouse_of.append(patient)
        db.session.commit()

        return "patient.spouses: " + str(patient.spouses) + "\nspouse_id: " + str(spouse_id) + "\nspouse_of_id: " + str(
            spouse_of_id) + "\nspouses: " + str(spouses) + "\nspouse_of: " + str(spouse_of) + "\nclear_spouses: " + str(
            clear_spouses) + "\nclear_spouse_of: " + str(clear_spouse_of)
    # we are in production mode
    else:
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()
        # clear arrays
        if clear_spouses and patient.spouses != None:
            patient.spouses = []
        if clear_spouse_of and patient.spouse_of != None:
            patient.spouse_of = []
        # if singleton IDs were provided
        if spouse_id != None and spouse_id != None:
            spouse = models.Pedigree_Patient.query.filter_by(id=spouse_id).first()
            spouse_of = models.Pedigree_Patient.query.filter_by(id=spouse_of_id).first()
            spouse.spouses.append(spouse_of)
        # if array of spouses and spouse_of are to be used
        if spouses != None:
            for spouse_entry in spouses:
                spouse_query = models.Pedigree_Patient.query.filter_by(id=spouse_entry.get("id")).first()
                patient.spouses.append(spouse_query)
                spouse_query.spouses.append(patient)
        if spouse_of != None:
            for spouse_of_entry in spouse_of:
                spouse_of_query = models.Pedigree_Patient.query.filter_by(id=spouse_of_entry.get("id")).first()
                patient.spouse_of.append(spouse_of_query)
                spouse_query.spouse_of.append(patient)
        db.session.commit()

        return "patient.spouses: " + str(patient.spouses) + "\nspouse_id: " + str(spouse_id) + "\nspouse_of_id: " + str(
            spouse_of_id) + "\nspouses: " + str(spouses) + "\nspouse_of: " + str(spouse_of) + "\nclear_spouses: " + str(
            clear_spouses) + "\nclear_spouse_of: " + str(clear_spouse_of)

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

# function for recalculating the FH conditions of a tree's node
# if nothing changed, return None
# else return a list of dicts, each containing a patient who's had fh conditions added and/or removed
@app.route('/canopy/recalculate_tree/<string:mode>', methods=['GET'])
def update_tree_fh_conditions(mode):
    tree_id = request.args.get('tree_id')
    if tree_id == "":
        tree_id = None
    if tree_id == None:
        return "Please provide a tree_id"

    if mode == "test":
        return None
    else:
        # get the final return statement ready
        message = "Tree refreshed!\nThe following patients have new family history conditions: "

        # get all the nodes of the tree
        tree_query = models.Pedigree_Tree.query.filter_by(id=tree_id).first()

        # get ready to store the patients who have different fh_conditions
        changed_patients = []
        # for each node in the tree, recalculate their fh_conditions
        for node in tree_query.nodes:
            recalculated_result = calculate_patient_fh_conditions(node.id, mode)
            if recalculated_result:
                changed_patients.append(recalculated_result)
        # for a tree with 0 nodes or an unchanged tree
        if len(changed_patients) == 0:
            message = "Tree refreshed!\nNo patients have new family history conditions"
        else:
            i = 1
            for patient_name in changed_patients:
                message += "\n" + str(i) + ". " + patient_name
        return message

# function for calculating the FH conditions of an individual node
# if nothing changed, return None
# else return patient name
def calculate_patient_fh_conditions(patient_id, mode):
    if mode == "test":
        return None
    else:
        # make a dictionary containing key value pairs of form fh_condition_id : 0 to store weighted sums
        condition_weights = {}
        conditions = models.Pedigree_Health_Condition.query.all()
        for condition in conditions:
            if(condition.fh_condition_id != None):
                condition_weights[condition.fh_condition_id] = 0

        # get the node pointed to by this patient ID
        patient = models.Pedigree_Patient.query.filter_by(id=patient_id).first()

        # make a note of the current FH conditions of the patient, at the end this will be used calculate the CHANGED
        # fh conditions that'll be returned
        previous_fh_condition_ids = []
        for condition in patient.fh_conditions:
            previous_fh_condition_ids.append(condition.fh_condition_id)

        # nested loops to calculate generations, starting with parents
        for parent in patient.parents:
            # check the parent's conditions
            for condition in parent.conditions:
                # for each of the parent's conditions that have a fh_condition_id, add the sum based on gender
                if condition.fh_condition_id != None:
                    if parent.gender == "male":
                        condition_weights[condition.fh_condition_id] += condition.male_parent
                        # print("male parent for disease " + condition.disease_id + " is: " + str(condition_weights[condition.fh_condition_id]))
                    elif parent.gender == "female":
                        condition_weights[condition.fh_condition_id] += condition.female_parent
                        # print("female parent for disease " + condition.disease_id + " is: " + str(condition_weights[condition.fh_condition_id]))

            # once parent's conditions are checked, loop upwards towards grandparents (parent's parents)
            for grandparent in parent.parents:
                # check the grandparent's conditions
                for condition in grandparent.conditions:
                    # for each of the grandparent's conditions that have a fh_condition_id, add the sum based on gender
                    if condition.fh_condition_id != None:
                        if grandparent.gender == "male":
                            condition_weights[condition.fh_condition_id] += condition.male_grandparent
                        elif grandparent.gender == "female":
                            condition_weights[condition.fh_condition_id] += condition.female_grandparent

        # store a boolean to check if there has been a difference between the old and new fh_conditions
        different = False
        # store the new fh_conditions, new fh_condition_ids, and new fh_condition_names
        new_fh_conditions = []
        new_fh_condition_ids = []
        new_fh_condition_names = []

        # check the weights of each condition, add to the new list if greater or equal to 1
        for condition_id in condition_weights:
            # check if the weight value is greater than 1
            # print("condition_id is " + condition_id)
            # print("condition_weights[condition_id] is " + str(condition_weights[condition_id]))
            if condition_weights[condition_id] >= 1:
                condition_query = models.Pedigree_Health_Condition.query.filter_by(fh_condition_id=condition_id).first()
                new_fh_conditions.append(condition_query)
                new_fh_condition_ids.append(condition_id)
                new_fh_condition_names.append(condition_query.fh_condition_name)
        # print(previous_fh_condition_ids)
        # print(new_fh_condition_ids)

        # check if the new_fh_condition_ids is the same as the old one
        # length check first
        if len(previous_fh_condition_ids) == len(new_fh_condition_ids):
            # length check passed
            # then check that all previous condition_ids are in the new condition_id array
            for previous_id in previous_fh_condition_ids:
                # keep track if we've found the previous id in the new ids
                found = False
                for new_id in new_fh_condition_ids:
                    # if found
                    if previous_id == new_id:
                        found = True
                        break
                # if never found, the lists are different
                if not found:
                    different = True
                    break
        else:
            # length check failed
            different = True
        # print("different is equal to: " + str(different))
        # print("condition_weights are: " + str(condition_weights))

        # if we do have different fh_conditions
        if different:
            # set the patient's fh conditions to the new one
            patient.fh_conditions = []
            for condition in new_fh_conditions:
                patient.fh_conditions.append(condition)
            db.session.commit()
            return patient.name
        else:
            return None