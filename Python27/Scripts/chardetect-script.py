#!C:\Python27\python.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'chardet==2.3.0','console_scripts','chardetect'
__requires__ = 'chardet==2.3.0'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('chardet==2.3.0', 'console_scripts', 'chardetect')()
    )
