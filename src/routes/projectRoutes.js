import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// import TrooprLoader from '../components/common/TrooprLoader';


import SidebarContainer from '../components/project/sidebar/SidebarContainer';
import ProjectTasks from '../components/project/tasks/ProjectTasks';
// import ProjectFiles from '../components/project/files/ProjectFiles';
import ProjectActivity from '../components/project/activity/ProjectActivity';
import ProjectReport from '../components/project/report/ProjectReport';
import project from "../components/project/project";
// import DefaultRoute from './defaultRoute';
import ProjectSettingsPage from '../components/project/settings/ProjectSettingsPage';
import Blank from '../components/blank';



const projectRoutes = () => (
	<div>
      	{/* <ProjectHeader headerType='project_header'/> */}
		<SidebarContainer />
		{/* <Suspense fallback={<TrooprLoader />}> */}
		<Switch>
		{/* <Route exact path="/:wId/project/:pId/tasks" component={project} /> */}
			<Route exact path="/:wId/squad/:pId/tasks/:tid" component={ project }/>
			<Route exact path="/:wId/squad/:pId/tasks/activity" component={ project }/>
			<Route exact path="/:wId/squad/:pId" render={(props) => <Redirect to={"/"+props.match.params.wId+"/squad/"+props.match.params.id+"/tasks"}/>}/>
			<Route path="/:wId/squad/:pId/tasks" component={ project}/>
			<Route exact path="/:wId/squad/:pId/files" render={(props) => <Redirect to={"/"+props.match.params.wId+"/squad/"+props.match.params.id+"/files/folder/src"}/>}/>
			
			
			{/*<Route exact path="/:wId/project/:id/files" component={FilesComingSoon}/>*/}
			<Route path='/:wId/squad/:pId/settings' component={ProjectSettingsPage} />
			
			{/* <Route path="/:wId/project/:pId/files/folder/:pId" component={  ProjectFiles }/> */}
			

			
			
			
			{/* <Route path="/:wId/project/:id/activity" component={ ProjectActivity }/> */}



			<Route path="/:wId/squad/:pId/activity" component={ ProjectActivity }/>
			<Route path="/:wId/squad/:pId/report" component={ ProjectReport }/>
			
			
			<Route path="/*" component={Blank} />
			{/* <Route path="/*" component={ DefaultRoute }/> */}
		</Switch>
		{/* </Suspense> */}
	</div>
);

export default projectRoutes;
