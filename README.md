# simple_admin_front
from simple_admin dashborad build  front  source~

#### build
* run yarn build
* rename simple_admin_templates/index.html to simple_admin_templates/simple_admin.template
* go get -u github.com/go-bindata/go-bindata/v3/go-bindata (options)
* run go-bindata -o bindata.go -pkg simple_admin -prefix "simple_admin_templates" -fs ./simple_admin_templates/...
* copy bindata.go to simple_admin folders

