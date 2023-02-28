/*
Initial db construction. Files are executed in alphabeticall order ( => based on the numerical prefix XXX_).

NOTE!: The db is initialized only on the first run => you need to rebuild the container 
+ delete db volume in order to run these scripts...
(another option is to delete postgres data under /var/lib/postgresql/data)
(anoter simplest option is: docker compose rm <db-service-name> && docker compose up,
this will do the trick too. Deleeting container from UI doesnt clean volumes)
(another working more userfriendly option?? TODO:)

*/