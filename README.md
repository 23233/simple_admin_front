# simple_admin_front
from simple_admin dashborad build  front  source~

#### build
* run yarn build
* rename simple_admin_templates/index.html to simple_admin_templates/simple_admin.template
* run go-bindata ./simple_admin_templates/...
* rename bindata.go package name to simple_admin
* copy bindata.go to simple_admin folders
