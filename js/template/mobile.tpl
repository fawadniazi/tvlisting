<div class="container-fluid">
	<div class="row-fluid">
		<div class="span12 mobile-header">
			<img src="img/mobile-header.png">
		</div>
	</div>
	<div class="row-fluid">
		<div class="span12">
			<div class="mobile-timeline">
			{{#each content}}
				<p class="l-date"><span>{{prettyDay}}</span> <img src="img/date-bg.png"></p>
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
 			{{/each}}
 			<div class="timeline l-timeline"></div>
 			</div>
		</div>
	</div>
</div><!-- container -->