#!/usr/bin/python3

import json
import jenkins
from jinja2 import Template
import xml.etree.ElementTree as ET

def createPipelines(file):
  # Open project configuration file
  config = json.load(open('json/' + file, 'r'))
  core = json.load(open('config.json', 'r'))

  try:
    server = jenkins.Jenkins(core['jenkins']['server'], core['jenkins']['username'], core['jenkins']['password'])
  except:
    print('Could not connect to the Jenkins server')

  # Create the view for the Pipelines
  try:
    server.create_view(config['key'], jenkins.EMPTY_VIEW_CONFIG_XML)
  except:
    print('Already exists')

  # Create the configuration xml file for the pipeline
  