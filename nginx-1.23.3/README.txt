open command prompt or terminal in same path as "nginx.exe"

NOTE : Use Command prompt in WINDOWS OS for all commands to work prroperly, In Power Shell some commands does not work.

>-----| ngnix Commands |-----<

"start nginx"	 				<--- to start nginx.exe in command prompt
"nginx -s stop"					<--- fast shutdown
"nginx -s quit"					<--- graceful shutdown
"nginx -s reload"				<--- changing configuration, starting new worker processes with a new configuration, graceful shutdown of old worker processes
"nginx -s reopen"				<--- re-opening log files


>-----| To check whether the nginx is running or not use next line command (Do not remove double quotes) |-----<

tasklist /fi "imagename eq nginx.exe"		        <--- This is command for checking nginx running status




if nginx is running then it will show something like this :

Image Name           PID Session Name     Session#    Mem Usage			<--- This is Result for nginx running in background
=============== ======== ============== ========== ============
nginx.exe            652 Console                 0      2 780 K
nginx.exe           1332 Console                 0      3 112 K


if nginx not running then it will show this :

INFO: No tasks are running which match the specified criteria.			<--- This is Result for nginx not detected as running in background



>-----| Dev |-----<

access_log   logs/site.log;			<--- add this lines in configuration file of nginx to record logs
root         C:/web/html;			<--- ?????????????