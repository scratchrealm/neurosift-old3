import { FunctionComponent } from "react";
import ApplicationBar, { applicationBarHeight } from "./ApplicationBar";
import GitHubAuthPage from "./GitHub/GitHubAuthPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import HomePage from "./pages/HomePage/HomePage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import WorkspacePage from "./pages/WorkspacePage/WorkspacePage";
import { SetupNSMain } from "./NSMainContext";
import useRoute from "./useRoute";
import useWindowDimensions from "./useWindowDimensions";

type Props = {
    // none
}

const MainWindow: FunctionComponent<Props> = () => {
    const {route} = useRoute()
    const {width, height} = useWindowDimensions()
    return (
        <SetupNSMain>
            <div style={{position: 'absolute', width, height}}>
                <div style={{position: 'absolute', width, height: applicationBarHeight}}>
                    <ApplicationBar />
                </div>
                <div style={{position: 'absolute', top: applicationBarHeight, width, height: height - applicationBarHeight}}>
                    {
                        route.page === 'home' ? (
                            <HomePage width={width} height={height - applicationBarHeight} />
                        ) : route.page === 'about' ? (
                            <AboutPage width={width} height={height - applicationBarHeight} />
                        ) : route.page === 'workspace' ? (
                            <WorkspacePage workspaceId={route.workspaceId} width={width} height={height - applicationBarHeight} />
                        ) : route.page === 'project' ? (
                            <ProjectPage projectId={route.projectId} width={width} height={height - applicationBarHeight} />
                        ) : route.page === 'github-auth' ? (
                            <GitHubAuthPage />
                        ) : (
                            <div>404</div>
                        )
                    }
                </div>
            </div>
        </SetupNSMain>
    )
}

export default MainWindow