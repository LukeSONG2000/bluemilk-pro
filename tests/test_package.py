"""Isolated package/SDK lifecycle integration; no game or network required."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT=Path(__file__).resolve().parents[1]
EDITOR=ROOT.parent/'bluemilk-editor'
sys.path.insert(0,str(EDITOR/'src/runtime'))
from mod_author import pack
from mod_store import install,registration

logs=EDITOR/'logs/pro-package-tests'
logs.mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory(dir=logs) as temporary:
    folder=Path(temporary)
    result=pack(ROOT/'mod',folder/'pro.bluemilk')
    install(folder/'pro.bluemilk',result['sha256'],folder/'store')
    manifest,source,digest=registration(result['sha256'],folder/'store')
    tested=subprocess.run(['node',str(ROOT/'tests/lifecycle.mjs')],
        input=json.dumps({'manifest':manifest,'source':source,'sha256':digest}),
        capture_output=True,text=True,encoding='utf8',timeout=30)
    print(tested.stdout,end='')
    if tested.returncode:print(tested.stderr);raise SystemExit(tested.returncode)
    print('Verified package bytes:',(folder/'pro.bluemilk').stat().st_size)
