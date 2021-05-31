#!/usr/bin/python3

import json
import jenkins
from jinja2 import Template
import xml.etree.ElementTree as ET
from shutil import copy

def create_pipeline(file):
  with open('json/' + file, 'r') as c_file:
    config = json.load(c_file)
    
    # Init Jenkins
    server = jenkins.Jenkins('http://10.6.14.73:8080', username='', password='')

    # Try to create the Pull-Requests view
    try:
      server.create_view('Pull-Requests', jenkins.EMPTY_VIEW_CONFIG_XML)
    except:
      print('View already exists!')

    # Create the configuration xml
    with open('jinja/pipeline.ps.xml.jinja') as f:
      tmpl = Template(f.read())
      xml_file = tmpl.render(
        pipeline_description=config['description'],
        path_to_jenkinsfile='integrator/generated/VM/PullRequest.Jenkinsfile'
      )

      # Create the pipeline
      try:
        server.create_job(config['name'] + '-PS', xml_file)
      except:
        print('Pipeline already exists')

      view_xml = server.get_view_config('Pull-Requests')
      tree = ET.fromstring(view_xml)
      ET.SubElement(tree[4], 'string').text = config['name'] + '-PS'
      new_view_xml = ET.tostring(tree, 'unicode')
      server.reconfig_view('Pull-Requests', new_view_xml)
  
    # Create the Jenkinsfile
    copy('jinja/jenkinsfile.ps.jinja', 'generated/' + config['key'] + '/PullRequest.Jenkinsfile')