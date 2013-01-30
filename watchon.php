<?php
//timestamp as sg time
$now = date_create("now");
$utcdesc = 'Asia/Singapore';
$now->setTimezone( new DateTimeZone( $utcdesc ) );
//current date format
$newdate = $now->format('Y-m-d H\:i\:s');
//unix timestamp to compare with sched
$newtimestamp = strtotime($newdate);
//date for the table header
$dtnow = $now->format('l\, F j');
//date for string w/out space format
$dtstr = $now->format('ymd');
//gets the current weekday and date to display on the top left side
$dtcurrentwday = date("D", $newtimestamp);
$dtcurrentdate = date("d M", $newtimestamp);

//assign default channel value
if(isset($_GET['channel'])){
	$channel = $_GET['channel'];
}else{
	$channel = 'SSG1';
	$regionname = 'Singapore';
}

function seconds_from_time($time) { 
    list($h, $m, $s) = explode(':', $time); 
    return ($h * 3600) + ($m * 60) + $s; 
}

function time_from_seconds($seconds) { 
    $h = floor($seconds / 3600); 
    $m = floor(($seconds % 3600) / 60); 
    $s = $seconds - ($h * 3600) - ($m * 60); 
    return sprintf('%02d:%02d:%02d', $h, $m, $s); 
}

//json data to read
$file = "http://apps.espnstar.asia/tvlisting/data/".$channel.$dtstr.".json";
$str_data = file_get_contents($file);
//decode json data
$data = json_decode($str_data,true);


//getting the channel type
switch($channel){
	case 'ECN1':
	case 'ESN1':
	case 'EID1':
	case 'EIN1':
	case 'EML1':
	case 'EPH1':
	case 'EPK1':
	case 'ESE1':
	case 'ESN1':
	case 'ETH1':
	case 'ETW1':
		$channeltype = '<img src="images/logo_wo_espn.png" width="182" height="34" alt="" />';
		break;
	case 'EINA':
	case 'HDSG':
	case 'EMLA':
	case 'ESEA':
	case 'ETWA':
		$channeltype = '<img src="images/logo_wo_espnhd.png" width="182" height="34" alt="" />';
		break;
	case 'SCN1':
	case 'SHK1':
	case 'SID1':
	case 'SIN1':
	case 'SML1':
	case 'SPK1':
	case 'SSE1':
	case 'SEN1':
	case 'SSG1':
	case 'SDN':
	case 'STW1':
	case 'STH1':
		$channeltype = '<img src="images/logo_wo_starsports.png" width="182" height="34" alt="" />';
		break;
	case 'SCR1':
	case 'SCRHK1':
		$channeltype = '<img src="images/logo_wo_starcricket.png" width="182" height="34" alt="" />';
		break;
	case 'SCRA':
		$channeltype = '<img src="images/logo_wo_starcrickethd.png" width="182" height="34" alt="" />';
		break;
	case 'FFC1':
		$channeltype = '<img src="images/logo_wo_foxfootball.png" width="182" height="34" alt="" />';
		break;
}

//gets the date/time sched
$nctr=0;
$channel_count = sizeof($data[$channel]);
for($x=0;$x<=$channel_count;$x++){
	if($data[$channel][$x]["channel_code"]!=''){
		//gets the date
		$dtarray = explode('-',$data[$channel][$x]["date"]);
		$dttimedate = '20'.$dtarray[2].'-'.$dtarray[0].'-'.$dtarray[1];
		// gets the time
		$dttimestart = seconds_from_time($data[$channel][$x]["start_time"]);
		$dttimeend = seconds_from_time($data[$channel][$x]["duration"]);
		//add the duration to the start time
		$dttimecombine = time_from_seconds($dttimestart + $dttimeend);
		//echo $dttimecombine.'<br>';
		
		//combine time with the date
		$dttime = $dttimedate.' '.$dttimecombine;
		//gets the unixtime of dttime
		$tvtimestamp = strtotime($dttime);
		//gets the date and time of airing the programme
		$airdatetime = strtotime($dttimedate.' '.$data[$channel][$x]["start_time"]);
		
		//check if airtime is next day
		$dttimenextday = date("ymd", $airdatetime);
		if($dttimenextday==$dtstr){
			$dtairsched = date("h:i A", $airdatetime);
		}else{
			$dtairsched = date("D", $airdatetime).'<br>'.date("d M", $airdatetime).'<br>'.date("h:i A", $airdatetime);
		}
		
		//echo $tvtimestamp.' > '.$newtimestamp.'<br>';
		if($tvtimestamp > $newtimestamp){
			$nctr++;
			switch($nctr){
				case 1:
					$time1= $dtairsched;
					$sched1=$data[$channel][$x]["programme"];
					$live1 = $data[$channel][$x]["live"];
					if($live1==='L'){
						$live1bg = 'style="width:292px; margin: 0 auto; height:57px; font-size:13px; background:url(images/whatson-bg-on.png) no-repeat top right;"';
					}else{
						$live1bg = 'style="width:292px; margin: 0 auto; height:57px; font-size:13px;"';
					}
					
					if($data[$channel][$x]["matchup"]==''){
						$matchup1 = '';
					}else{
						$matchup1 = $data[$channel][$x]["matchup"];
					}
					break;
				case 2:
					$time2= $dtairsched;
					$sched2=$data[$channel][$x]["programme"];
					$live2 = $data[$channel][$x]["live"];
					if($live2==='L'){
						$live2bg = 'style="width:292px; margin: 0 auto; height:57px; font-size:13px; background:url(images/whatson-bg-on.png) no-repeat top right;"';
					}else{
						$live2bg = 'style="width:292px; margin: 0 auto; height:57px; font-size:13px;"';
					}

					if($data[$channel][$x]["matchup"]==''){
						$matchup2 = '';
					}else{
						$matchup2 = $data[$channel][$x]["matchup"];
					}
					break;
				case 3:
					$time3= $dtairsched;
					$sched3=$data[$channel][$x]["programme"];
					$live3 = $data[$channel][$x]["live"];
					if($live3==='L'){
						$live3bg = 'style="width:292px; margin: 0 auto; height:57px; font-size:13px; background:url(images/whatson-bg-on.png) no-repeat top right;"';
					}else{
						$live3bg = 'style="width:292px; margin: 0 auto; height:57px; font-size:13px;"';
					}

					if($data[$channel][$x]["matchup"]==''){
						$matchup3 = '';
					}else{
						$matchup3 = $data[$channel][$x]["matchup"];
					}
					break;
			}
		}
	}
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
<style type="text/css">
<!--
body {
	margin:0;
	padding:0;
	font-family:Arial, Helvetica, sans-serif;
}
#container {
	width:300px;
	height:250px;
	background:url(images/whatson-bg.png) no-repeat;
	margin:0;
	padding:0;
}
.bottom {
	margin:0 auto;
}
.tvlink {
	width:120px;
	display:block;
	margin:5px auto 0 auto;
	text-align:center;
}
.tvlink a {
	color:#3a577f;
	font-size:12px;
	text-decoration:underline;
}
.tvlink a:hover {
	color:#000;
	text-decoration:none;
}
.live img {
	width:40px;
	height:12px;
	margin-top:5px;
	margin-left:18px
}
.tdheader {
	width:292px;
	margin: 0 auto;
	padding-top:7px;
	height:44px;
	font-size:13px;
}
.tdtime {
	color:#FFF;
	font-size:13px;
	font-weight:bold;
}
-->
</style>
</head>
<body>
<div id="container">
  <div class="tdheader">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td width="23%" align="center"><span style="font-size:18px; color:#333;"><strong><?php echo $dtcurrentwday; ?></strong></span><br />
          <span style="font-size:13px; color:#333;"><strong><?php echo $dtcurrentdate; ?></strong></span></td>
        <td width="77%" align="center"><?php echo $channeltype; ?></td>
      </tr>
    </table>
  </div>
  <div <?php echo $live1bg; ?> >
    <table width="100%" border="0" cellspacing="0" cellpadding="0" height="57">
      <tr>
        <td width="23%" align="center" class="tdtime"><?php echo $time1; ?></td>
        <td width="77%" style="color:#000;"><div>
            <div style="width:215px;margin-left:9px;"><span style="font-size:13px; font-weight:bold; color:#3a577f;"><?php echo $sched1;if($matchup1!=''){echo ': ';} ?></span><span style="font-size:13px;"><?php echo $matchup1; ?>&nbsp;</span>
              <?php if($live1==='L'){ ?>
              <span style="margin-top:2px;" ><img src="images/icon_live.jpg" alt="" width="23" height="10" /></span>
              <?php } ?>
            </div>
          </div></td>
      </tr>
    </table>
  </div>
  <div <?php echo $live2bg; ?> >
    <table width="100%" border="0" cellspacing="0" cellpadding="0" height="57">
      <tr>
        <td width="23%" align="center" class="tdtime"><?php echo $time2; ?></td>
        <td width="77%" style="color:#000;"><div>
            <div style="width:215px;margin-left:9px;"><span style="font-size:13px; font-weight:bold; color:#3a577f;"><?php echo $sched2;if($matchup2!=''){echo ': ';} ?></span><span style="font-size:13px;"><?php echo $matchup2; ?>&nbsp;</span>
              <?php if($live2==='L'){ ?>
              <span style="margin-top:2px;" ><img src="images/icon_live.jpg" alt="" width="23" height="10" /></span>
              <?php } ?>
            </div>
          </div></td>
      </tr>
    </table>
  </div>
  <div <?php echo $live3bg; ?> >
    <table width="100%" border="0" cellspacing="0" cellpadding="0" height="57">
      <tr>
        <td width="23%" align="center" class="tdtime"><?php echo $time3; ?></td>
        <td width="77%" style="color:#000;"><div>
            <div style="width:215px;margin-left:9px;"><span style="font-size:13px; font-weight:bold; color:#3a577f;"><?php echo $sched3;if($matchup3!=''){echo ': ';} ?></span><span style="font-size:13px;"><?php echo $matchup3; ?>&nbsp;</span>
              <?php if($live3==='L'){ ?>
              <span style="margin-top:2px;" ><img src="images/icon_live.jpg" alt="" width="23" height="10" /></span>
              <?php } ?>
            </div>
          </div></td>
      </tr>
    </table>
  </div>
  <div class="bottom"><span class="tvlink"><a href="http://www.espnstar.com/tv-listings/region1/day1/" title="View full TV Listings" target="_top">View
        full TV Listings</a></span></div>
</div>
<!-- ESS OMNITURE CODE -->
<!-- SiteCatalyst code version: H.24.1.
Copyright 1996-2011 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com -->
<script src="http://www.espnstar.com/generated_files/pub_module/script/s807.js" type="text/javascript" ></script>
<!--------------------------------------------------------------------------------->
<script language="JavaScript" type="text/javascript">
<!--
s_omni.pageName="www.espnstar.com:widgets:tv-listing" //Pagename (all small caps recommended). E.g. football:bpl:results
s_omni.server="" 
s_omni.channel="widgets" //Site Sections/First level (first part of your pagename) E.g. football
s_omni.pageType=""
s_omni.prop1="www.espnstar.com"
s_omni.prop2=""
s_omni.prop3="content"
s_omni.prop4="" //Content type E.g. video, content, game or audio
s_omni.prop5="tv-listing" //Site Section Level 2 E.g. bpl
s_omni.prop25="" //Sport E.g. football
s_omni.prop26="" //League E.g. bpl
s_omni.prop30="n"
s_omni.hier1=s_omni.pageName; //Content Hierarchy
/* Conversion Variables */
s_omni.campaign=""
s_omni.state=""
s_omni.zip=""
s_omni.events=""
s_omni.products=""
s_omni.purchaseID=""
s_omni.eVar1=""
s_omni.eVar2=""
s_omni.eVar3=""
s_omni.eVar4=""
s_omni.eVar5=""
/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code=s_omni.t();if(s_code)document.write(s_code)//--></script>
<script language="JavaScript" type="text/javascript"><!--
if(navigator.appVersion.indexOf('MSIE')>=0)document.write(unescape('%3C')+'\!-'+'-')
//-->
</script>
<noscript>
<img src="http://espn.112.2o7.net/b/ss/wdgespstar,wdgespinternational/1/H.24.1--NS/0" height="1" width="1" border="0" alt="" />
</noscript>
<!--/DO NOT REMOVE/-->
<!-- End SiteCatalyst code version: H.24.1. -->

<!-- BEGIN EFFECTIVE MEASURE CODE -->
<!-- COPYRIGHT EFFECTIVE MEASURE -->
<script type="text/javascript">
    (function() {
        var em = document.createElement('script'); em.type = 'text/javascript'; em.async = true;
        em.src = ('https:' == document.location.protocol ? 'https://sg-ssl' : 'http://sg-cdn') + '.effectivemeasure.net/em.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(em, s);
    })();
</script>
<noscript>
<img src="//sg.effectivemeasure.net/em_image" alt="" style="position:absolute; left:-5px;" />
</noscript>
<!--END EFFECTIVE MEASURE CODE -->

<!-- BEGIN COMSCORE TAG -->
<script>var _comscore = _comscore || [];_comscore.push({ c1: "2", c2: "3000005" });(function() {var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";el.parentNode.insertBefore(s, el);})();
</script>
<noscript>
<img src="http://b.scorecardresearch.com/p?c1=2&c2=3000005&cv=2.0&cj=1" />
</noscript>
<!-- END COMSCORE TAG -->

<!-- BEGIN GA CODE -->
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-4432811-1']);
  _gaq.push(['_setDomainName', 'espnstar.com']);
  _gaq.push(['_setLocalRemoteServerMode']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
<!--END GA CODE -->
</body>
</html>