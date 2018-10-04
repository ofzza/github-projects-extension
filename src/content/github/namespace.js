// ============================================================================================
// GitHub projects plugin, GitHub
// ============================================================================================
import { namespace as ns } from '../namespace';
const projectId = window.location.pathname
        .split('/')
        .slice(1,3)
        .join('_')
        .toLowerCase();
export const namespace = `${ns}_github_${projectId}`;
