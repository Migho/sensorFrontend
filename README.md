Server is running at https://sensorfrontend.herokuapp.com/

Link to backend project: https://github.com/Migho/sensorBackend

Please note that both backend and frontend are running on free Heroku dyno, which causes them to sleep after 30 minutes of inactivity. Waking up both of them can take some time and sometimes even require a page refresh. This also means that backend cannot keep saving the sensor data and causes gaps to the graph, so it's not a bug.

How to run:
```
npm install
npm start
```