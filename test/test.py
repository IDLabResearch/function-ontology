from json import load
import os
from glob import glob
import rdflib
import pyshacl

def load_graph(fpath) -> rdflib.Graph:
    g = rdflib.Graph()
    g.parse(fpath)
    return g

shape = load_graph('shape.ttl')
valid_resources = glob(os.path.join('test','resources','valid', '*.ttl'))
invalid_resources = glob(os.path.join('test','resources','invalid', '*.ttl'))


def validate(fpath_data, shape):
    kwargs_shacl_validate = {
        'inference'     : 'rdfs',
        'advanced'      : True,
        'allow_infos'   : True,
        'allow_warnings': True
    }
    g = load_graph(fpath_data)
    return pyshacl.validate(g, shacl_graph=shape, **kwargs_shacl_validate)

print('Resources that should conform')
for x in valid_resources:
    conforms, results_graph, results_text = validate(x, shape)
    print(f'''{x}
    conforms: {conforms}
    ''')

print('Resources that should NOT conform')
for x in invalid_resources:
    conforms, results_graph, results_text = validate(x, shape)
    print(f'''{x}
    conforms: {conforms}
    ''')






