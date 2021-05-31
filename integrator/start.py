#!/usr/bin/python3

import json
import os

import pipeline
import generator
import ps

jsons = json.load(open('integrated.json', 'r'))['jsons']

for file in os.listdir('json'):
  if not any(file in el for el in jsons):
    print('Creating pipelines from ' + file + ' ...')
    #TODO: pipeline.createPipelines(file)
    print('Creating files from ' + file + ' ...')
    # generator.createPipelines(file)
    ps.create_pipeline(file)
  else:
    print('Pipelines already created from ' + file)
    print('To recreate the pipelines use the recreation script!')
