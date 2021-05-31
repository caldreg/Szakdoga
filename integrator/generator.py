#!/usr/bin/python3

import json
import os
import shutil

def createPipelines(file):
  
  config = json.load(open('json/' + file, 'r'))

  # Create Jekinsfile for Pre-staging
  try:
    os.mkdir('generated/' + config['key'])
  except:
    shutil.rmtree('generated/' + config['key'])
    os.mkdir('generated/' + config['key'])

  auth_string='{{user}}:{{devopspass}}'
  authed_repo = '{}{}@{}'.format(config['repository'][0:8], auth_string, config['repository'][8:])
  clone_name = config['repository'].split('/')[5].replace('.git', '')

  
  