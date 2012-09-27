<div class="container-fluid">
	<div class="row-fluid">
		<div class="span12 mobile-header">
			<img src="img/mobile-header.png">
		</div>
		<ul id="time-selector">
			<li class="active">Now</li>
			<li>1 day ago</li>
			<li>3 days ago</li>
			<li>5 days ago</li>
			<li>7 days ago</li>
		</ul>
	</div>
	<div class="row-fluid">
		<div class="span12">
			<div class="mobile-timeline">
			{{#each content}}
				<p class="l-date" id="{{unbound prettyDay}}"><span>{{prettyDay}}</span> <img src="img/date-bg.png"></p>
				<ul class="l-one-list">
					{{#each arr}}
					<li class="l-li">
						<p class="time"><span>{{prettyTime}}</span> <img src="img/dot.png"></p>
						<div class="li-wrapper">
							<img class="l-mobile-pic pics" {{bindAttr src="imgSrc"}}>
							<img class="l-pic-shadow" src="img/pic-shadow.png">
							<div class="toolbar">
								<div class="toolbar-wrapper">
									<a class="download" href="{{unbound original}}" target="_blank">Download</a>
									<a href="#" class="share" {{bindAttr data-img="imgSrc"}} {{action sharePics target="view.parentView.parentView.controller"}}>Share</a>
								</div>
							</div>
						</div>
					</li>
					{{/each}}
 			</ul>
 			<ul class="load-next">
				<li><a class="btn">Load earlier pictures</a></li>
			</ul>
 			{{/each}}
 			<!--<ul class="load-rest">
 				<li><a class="btn" href="#" {{action loadRest target="view"}}>Load Earlier Pictures</a></li>
 			</ul>-->
 			<div class="timeline l-timeline"></div>
 			</div>
		</div>
	</div>
</div><!-- container -->