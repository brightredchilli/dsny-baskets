 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
  <div class="bg-white dark:bg-slate-800 min-h-screen text-slate-800 dark:text-slate-50">
    <div class='container max-w-screen-lg px-10 mx-auto'>
      
      <h1 class='text-4xl text-left pt-12 mb-5'>
        How is easy is it for you to keep your city clean?
      </h1>

      <div class="sm:grid sm:grid-cols-12 gap-x-4">
        <div class="col-span-6">
          <p>
            The following is a visualization of the locations of litter baskets maintained by the
            Department of Sanitation of New York. Find the nearest trash can near you!
          <p>
        </div>
        <div id="leafletcontainer" class="col-span-6">
        </div>
      </div>
    </div>
  </div>
`;function $1(Z){let P=document.getElementById("leafletcontainer"),g=P.getBoundingClientRect();P.style.height=`${g.width*2/3}px`;const Q=s4.latLngBounds([40.38264,-74.31015],[41.14143,-73.22319]);let I=s4.map(P,{maxBounds:Q,maxBoundsViscosity:.8}).setView(Z,12);s4.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",{maxZoom:20,attribution:'&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors'}).addTo(I),J1(q1,I).then()}const Q1=[40.73061,-73.935242];$1(Q1);