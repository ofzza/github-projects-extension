// ============================================================================================
// GitHub projects add New Issue button
// ============================================================================================

/**
 * Initialize and implement personal issues' notes functionality
 * @export
 */
export default function () {

  // Check if /projects page
  if (['projects'].indexOf(window.location.pathname.split('/')[3]) > -1) {

    // Inject new issue button
    const divEl = document.createElement('div');
    divEl.style.flex = '1';
    divEl.style.padding = '0 10px';
    const btnEl = document.createElement('a');
    btnEl.href = `${ window.location.pathname.split('/').slice(0, 3).join('/') }/issues/new`;
    btnEl.className = 'btn btn-primary';
    btnEl.setAttribute('role', 'button');
    btnEl.innerHTML = 'New issue';
    divEl.appendChild(btnEl);
    const target = document.querySelector('.project-header-controls');
    target.parentNode.insertBefore(divEl, target);


  }

}
