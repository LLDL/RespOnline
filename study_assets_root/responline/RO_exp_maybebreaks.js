/* Following this tutorial: https://www.jspsych.org/tutorials/rt-task/
	Here are the comments I would have put in the preamble if I'd had the ability to...
		the value between the <title> tags is what shows up as the title of the webpage.
		the next 3 lines, both <script> tags, tell it to use certain modules of jspsych.
		after that, we add a reference to JATOS so that we'll be able to use that, too!
			<script src="/assets/javascripts/jatos.js"><\/script> 
			\\delete the other \
		then the <link> tags part controls the aesthetic look of the study.
		I don't know what the <body> tags do, but I assume it's important :)
		then we get into the body of the experiment.

Description
In RespOnline, participants listen to sounds along three continua (d-b, d-n, m-n), 
while breathing through either their nose or their mouth, and identify the sounds. 
Participants first complete the online consent form and questionnaire. Afterwards, participants
receive instructions on-screen which allows them to adjust the volume to a comfortable level.
On this instructions page, participants are also told that the study requires them to breathe
through their nose and that if they are unable to do so, that they are not eligible for the study.
The text also advises that the participant considers completing the study another day if they
are currently experiencing a cold. After they have read the instructions and have adjusted
their volume, participants are randomly assigned to be instructed either to breathe through 
their nose first then breathe through their mouth, or vice versa. Stimuli will be presented the 
following order: 1) crosshair is quickly shown on the screen, 2) audio is played on a blank screen,
3) one of the following is displayed on the screen: "D or B?","D or N?", "M or N?". Participants will
identify which sound they heard by pressing the left or right arrow key (e.g. "D or B?", D = left, 
B = right). Within each condition (nose, mouth), participants will be given 3 breaks. After 
completing all trials, participants will be thanked for their participation and given a participant 
ID (so we can identify people) which they will need to provide when they claim their RPS credits 
from the lab.
	*/
	
	//blur count; counts how many times a subject changes out of the experiment tab --
	// too many will result in participant being flagged "-likely-invalid"
	var blur_count = 0; //number of times subject's focus leaves tab
	var likely_invalid = false; //gets set to true if blur_count>threshold
	
	//create a variable called "timeline"; this is what we'll add our trials to
	var timeline = [];
	
	// from Google, has rests in timeline	
	/* var timeline = [welcome, training];
		for(var i=0; i<blocks.length; i++){
  		timeline.push(blocks[i]);
  		timeline.push(rest);
		}
		timeline.push(thankyou);
*/	
		
	//initiate data object, so we can get a subject number from JATOS and show it in debrief
	var resultData = {};

	//now let's welcome people to the study
	var welcome = {
		type: 'instructions',
   		pages: [
        '<h2>Instructions</h2><p>This study involves tasks that involve listening to audio clips. ' +
			'Please <strong>put on your headphones</strong>.</p><p> To make sure your headphones are set to a ' +
			'comfortable volume, play the following audio clip and adjust accordingly.</p><audio preload="auto" controls><source src="audio/sample.mp3" type="audio/mpeg"></audio>' + 
			'<p>This study also requires you to breathe through your nose.</p><p> If you are congested ' + 
			'or are unable to do this due to other reasons, you are <strong>not</strong> eligible for the study. ' + 
			'If you are congested, please consider doing this study another day.</p>' + 
			'<p>This study takes about 15 minutes. You will be given four breaks throughout the study.</p>' + 
			'<p>When you are ready to begin, press <b>Next</b> to begin the study.</p>',
    ],
    	show_clickable_nav: true,
    	button_label_next: 'Next',
    	allow_keys: false
};
	
	//and add this to the timeline
	timeline.push(welcome);

	//this upcoming trial will show instructions to the subject.
	var instructions = {
		type: "instructions",
		pages: [
		"<p>In this experiment, we ask you to <strong>breathe</strong> in a " +
			"certain way while <strong>identifying sounds</strong>.</p>" +
			"<p>In each trial, you will hear one of two sounds over the headphones, " +
			"and you will identify which one you heard by pressing the <strong>left</strong> "+
			"or <strong>right</strong> arrow, as indicated.</p>" +
			"<p>Please respond as quickly and accurately as possible.</p>" +
			"<p>During certain blocks of trials, you will be asked to breathe <strong>" +
			"only through your mouth</strong>, and in others you will be asked to breathe "+
			"<strong>only through your nose</strong>. Please pay attention to which "+
			"block you are in as you do the study.</p>" +
			"<p>Press <b>Next</b> to begin the study.</p>",
		],
		show_clickable_nav: true,
   		button_label_next: 'Next',
   	 	allow_keys: false,
		timing_post_trial: 8000
	};
	
	//and add this to the instructions as well!
	timeline.push(instructions);

/*These are the instructions from the BreathSpeech ethics approval:
In this study we will ask you to breathe in a certain way for short periods while identifying auditory sounds.

Please put on headphones for this task, and adjust sound levels to a comfortable volume. 
In a single experimental trial, you will hear one of two sounds over the headphones, 
and please identify these sounds as being [Sound A response, like “ada” or “flute”] or 
[Sound B response, like “ana” or “bassoon”] by pressing the indicated keys on the keyboard.
 Your responses should be made as quickly but also as accurately as possible. 
 Your responses and reaction times will be recorded.

You will complete several blocks of trials, each of which will last a few minutes. 
In total, this study will last 5-10 minutes. In some blocks of trials, 
you will be asked to breathe through your mouth (and not through your nose) 
while doing this auditory perception task. In other blocks of trials, 
you will be asked to breathe through your nose (and not through your mouth) 
while doing the task. Please follow the text prompts given to you before each block.

There is a brief practice phase before the actual study begins. Press any key to continue.
*/
	
	var nose_instr = {
		type: 'image-keyboard-response',
		data: {test_part: 'instructions', blocktype: 'nose'},
		stimulus: 'img/nose.jpeg',
		prompt: '<p>For this upcoming block, breathe only through your nose.</p>',
		choices: jsPsych.NO_KEYS,
		trial_duration: 2000
	};
	
	var mouth_instr = {
		type: 'image-keyboard-response',
		data: {test_part: 'instructions', blocktype: 'mouth'},
		stimulus: 'img/mouth.png',
		prompt: '<p>For this upcoming block, breathe only through your mouth.</p>',
		choices: jsPsych.NO_KEYS,
		trial_duration: 2000
	};
	
	//get an integer between 0-99 
	randomint = Math.floor(Math.random()*100);

	//random choice between mouth block and nose block, dleft and dright
	if(randomint > 74){
		timeline.push(nose_instr);
		dvalue = "leftarrow";
		nvalue = "rightarrow";
	} else if(randomint > 49){
		timeline.push(mouth_instr);
		dvalue = "leftarrow";
		nvalue = "rightarrow";
	} else if(randomint > 24){
		timeline.push(nose_instr);
		dvalue = "rightarrow";
		nvalue = "leftarrow";
	} else if(randomint < 25){
		timeline.push(mouth_instr);
		dvalue = "rightarrow";
		nvalue = "leftarrow";
	}

	//defining the parts of the main procedure
	var fixation = {type: 'html-keyboard-response',
		data: {test_part: 'fixation'},
		stimulus: '<div style="font-size:60px;">+</div>',
		choices: jsPsych.NO_KEYS,
		trial_duration: 500
	};
	
	var audiopresentation = {
		type: 'audio-keyboard-response',
		data: {test_part: 'test'},
		stimulus: jsPsych.timelineVariable('stimulus'),
		prompt: "",
		choices: jsPsych.NO_KEYS,
		trial_duration: 1100
	};
	
	var responselog = {
		type: 'html-keyboard-response',
		stimulus: "",
		data: jsPsych.timelineVariable('data'),
		prompt: function(){return "Do you hear "+jsPsych.timelineVariable('segments',true);},
		choices: jsPsych.timelineVariable('choices'),
		on_finish: function(data){
			if(data.key_press){
				data.response = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press);
			}/*
			else{
   				return
   			}*/
		},
		trial_duration: 15000
	};
	
	var nose_rest = {
		type: 'html-keyboard-response',
		stimulus: '<p>Break time!</p><p> Feel free to breathe as you like, </p><p>but please stay on this screen.</p><p>Remember to return to nose-breathing at the end of the break!</p><p> Click <b>Next</b> to continue when you are ready.</div></p>',
  	 	show_clickable_nav: true,
    	button_label_next: 'Next',
    	allow_keys: false
    	/* choices: jsPsych.NO_KEYS,
		trial_duration: 1100 */
	};
	
	var mouth_rest = {
		type: 'html-keyboard-response',
		stimulus: '<p>Break time!</p><p> Feel free to breathe as you like, </p><p>but please stay on this screen.</p><p>Remember to return to nose-breathing at the end of the break!</p><p> Click <b>Next</b> to continue when you are ready.</div></p>',
  	 	show_clickable_nav: true,
    	button_label_next: 'Next',
    	allow_keys: false
    	/* choices: jsPsych.NO_KEYS,
		trial_duration: 1100 */
	};
		
	// test stimuli bank ??????
/* var test_stimuli = [
	{stimulus: 'audio/bd/stimulus003.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus004.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus005.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus006.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus007.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus008.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus009.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus010.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus011.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus012.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus013.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus014.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus015.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus016.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus017.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus018.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus019.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus020.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus021.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus022.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus023.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus024.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus025.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus026.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus027.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus028.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus029.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus030.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus031.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus032.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus033.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus034.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus035.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus036.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus037.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus038.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus039.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus040.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus041.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus012.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus013.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus014.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus015.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus016.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus017.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus018.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus019.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus020.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus021.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus022.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus023.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus024.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus025.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus026.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus027.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus028.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus029.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus030.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus031.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus032.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus033.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus034.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus035.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus036.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus037.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus038.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus039.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus040.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus041.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus042.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus043.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus044.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus045.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus046.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus047.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus048.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus049.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus050.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			{stimulus: 'audio/bd/stimulus051.wav', segments: "<strong>D</strong> (left) or <strong>B</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'db'}},
			//dn bracket now
			{stimulus: 'audio/dn/018.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/019.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/020.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/021.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/022.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/023.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/024.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/025.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/026.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/027.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/028.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/029.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/030.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/031.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/032.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/033.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/034.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/035.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/036.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/037.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/038.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/039.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/040.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/041.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/042.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/043.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/044.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/045.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/046.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/047.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/048.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/049.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/050.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/051.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/052.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/053.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/054.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/055.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/056.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/057.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/028.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/029.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/030.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/031.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/032.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/033.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/034.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/035.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/036.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/037.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/038.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/039.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/040.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/041.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/042.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/043.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/044.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/045.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/046.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/047.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/048.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/049.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/050.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/051.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/052.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/053.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/054.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/055.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/056.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/057.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/058.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/059.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/060.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/061.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/062.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/063.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/064.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/065.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/066.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			{stimulus: 'audio/dn/067.wav', segments: "<strong>D</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'dn'}},
			//mn block
			{stimulus: 'audio/mn/013.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/014.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/015.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/016.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/017.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/018.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/019.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/020.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/021.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/022.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/023.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/024.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/025.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/026.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/027.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/028.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/029.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/030.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/031.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/032.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/033.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/034.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/035.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/036.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/037.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/038.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/039.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/040.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/041.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/042.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/043.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/044.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/045.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/046.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/047.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/048.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/049.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/050.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/051.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/052.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/023.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/024.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/025.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/026.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/027.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/028.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/029.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/030.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/031.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/032.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/033.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/034.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/035.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/036.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/037.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/038.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/039.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/040.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/041.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/042.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/043.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/044.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/045.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/046.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/047.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/048.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/049.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/050.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/051.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/052.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/053.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/054.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/055.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/056.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/057.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/058.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/059.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/060.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/061.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}},
			{stimulus: 'audio/mn/062.wav', segments: "<strong>M</strong> (left) or <strong>N</strong> (right)?", choices: ['leftarrow','rightarrow'], data: {blocktype: "nose", dvalue: dvalue, nvalue: nvalue, test_part: 'test', stimtype: 'mn'}}
			],
			
	// ??????? I found this
	var sample = jsPsych.randomization.sampleWithoutReplacement(test_stimuli, 80);		
			*/
		

	//main procedures (4, one each for dleft/dright, nose/mouth)
	var main_procedure_dleft_nose = {
		timeline: [
			fixation,
			audiopresentation,
			responselog
		],
		timeline_variables: test_stimuli, 
		//repetitions://
		randomize_order: true,
		sample : {
			type: 'without-replacement',
			size: 80 // x trials, without replacement
		}
	};
	
	var main_procedure_dleft_mouth = {
		timeline: [
			fixation,
			audiopresentation,
			responselog
		],
		timeline_variables:  test_stimuli, 
		randomize_order: true,
		sample : {
			type: 'without-replacement',
			size: 80 // x trials, without replacement
		}
	};
	
	var main_procedure_dright_nose = {
		timeline: [
			fixation,
			audiopresentation,
			responselog
		],
		timeline_variables:  test_stimuli, 
		randomize_order: true,
		sample : {
			type: 'without-replacement',
			size: 80 // x trials, without replacement
		}
	};
	
	var main_procedure_dright_mouth = {
		timeline: [
			fixation,
			audiopresentation,
			responselog
		],
		timeline_variables: test_stimuli, 
		randomize_order: true,
		sample : {
			type: 'without-replacement',
			size: 80 // x trials, without replacement
		}
	};
	
	// order possibilities (includes rests)
	if(randomint > 74){
		timeline.push(main_procedure_dleft_nose);
		timeline.push(nose_rest);
		timeline.push(main_procedure_dleft_nose);
		timeline.push(nose_rest);
		timeline.push(main_procedure_dleft_nose);
		timeline.push(mouth_instr);
		timeline.push(main_procedure_dleft_mouth);
		timeline.push(mouth_rest);
		timeline.push(main_procedure_dleft_mouth);
		timeline.push(mouth_rest);
		timeline.push(main_procedure_dleft_mouth);
	} else if(randomint > 49){
		timeline.push(main_procedure_dleft_mouth);
		timeline.push(mouth_rest);
		timeline.push(main_procedure_dleft_mouth);
		timeline.push(mouth_rest);
		timeline.push(main_procedure_dleft_mouth);
		timeline.push(nose_instr);
		timeline.push(main_procedure_dleft_nose);
		timeline.push(nose_rest);
		timeline.push(main_procedure_dleft_nose);
		timeline.push(nose_rest);
		timeline.push(main_procedure_dleft_nose);
	} else if(randomint > 24){
		timeline.push(main_procedure_dright_nose);
		timeline.push(nose_rest);
		timeline.push(main_procedure_dright_nose);
		timeline.push(nose_rest);
		timeline.push(main_procedure_dright_nose);
		timeline.push(mouth_instr);
		timeline.push(main_procedure_dright_mouth);
		timeline.push(mouth_rest);
		timeline.push(main_procedure_dright_mouth);
		timeline.push(mouth_rest);
		timeline.push(main_procedure_dright_mouth);
	} else if(randomint < 25){
		timeline.push(main_procedure_dright_mouth);
		timeline.push(mouth_rest);
		timeline.push(main_procedure_dright_mouth);
		timeline.push(mouth_rest);
		timeline.push(main_procedure_dright_mouth);
		timeline.push(nose_instr);
		timeline.push(main_procedure_dright_nose);
		timeline.push(nose_rest);
		timeline.push(main_procedure_dright_nose);
		timeline.push(nose_rest);
		timeline.push(main_procedure_dright_nose);
	}

	//we can also debrief our participants after the study, to tell them how they did!
		var debrief_block = {
		type: "html-keyboard-response",
		stimulus: function(){
			//first, filter out the fixation screens, and the 'd' responses:
			//var trials = jsPsych.data.get().filter({test_part: 'test'});
			//var correct_trials = trials.filter({correct: true});
			//then calculate their accuracy overall
			//var accuracy = Math.round(correct_trials.count()/trials.count() * 100);
			//and calculate the mean response time:
			//var rt = Math.round(correct_trials.select('rt').mean());
			//and share it to the screen!
			return "<p>Thank you for participating in our study.</p>"+
			"<p>Your partipant code is </p><p><b>RO-" + jatos.studyResultId +
			"</b></p><p>Press any key to complete the experiment. Thanks!</p>";
		}
	};
	timeline.push(debrief_block);
	
	var audio = ['audio/bd/stimulus001.wav', 'audio/bd/stimulus002.wav', 'audio/bd/stimulus003.wav', 'audio/bd/stimulus004.wav', 'audio/bd/stimulus005.wav', 'audio/bd/stimulus006.wav', 'audio/bd/stimulus007.wav', 'audio/bd/stimulus008.wav', 'audio/bd/stimulus009.wav', 'audio/bd/stimulus010.wav', 'audio/bd/stimulus011.wav', 'audio/bd/stimulus012.wav', 'audio/bd/stimulus013.wav', 'audio/bd/stimulus014.wav', 'audio/bd/stimulus015.wav', 'audio/bd/stimulus016.wav', 'audio/bd/stimulus017.wav', 'audio/bd/stimulus018.wav', 'audio/bd/stimulus019.wav', 'audio/bd/stimulus020.wav', 'audio/bd/stimulus021.wav', 'audio/bd/stimulus022.wav', 'audio/bd/stimulus023.wav', 'audio/bd/stimulus024.wav', 'audio/bd/stimulus025.wav', 'audio/bd/stimulus026.wav', 'audio/bd/stimulus027.wav', 'audio/bd/stimulus028.wav', 'audio/bd/stimulus029.wav', 'audio/bd/stimulus030.wav', 'audio/bd/stimulus031.wav', 'audio/bd/stimulus032.wav', 'audio/bd/stimulus033.wav', 'audio/bd/stimulus034.wav', 'audio/bd/stimulus035.wav', 'audio/bd/stimulus036.wav', 'audio/bd/stimulus037.wav', 'audio/bd/stimulus038.wav', 'audio/bd/stimulus039.wav', 'audio/bd/stimulus040.wav', 'audio/bd/stimulus041.wav', 'audio/bd/stimulus042.wav', 'audio/bd/stimulus043.wav', 'audio/bd/stimulus044.wav', 'audio/bd/stimulus045.wav', 'audio/bd/stimulus046.wav', 'audio/bd/stimulus047.wav', 'audio/bd/stimulus048.wav', 'audio/bd/stimulus049.wav', 'audio/bd/stimulus050.wav', 'audio/bd/stimulus051.wav', 'audio/bd/stimulus052.wav', 'audio/bd/stimulus053.wav', 'audio/bd/stimulus054.wav', 'audio/bd/stimulus055.wav', 'audio/bd/stimulus056.wav', 'audio/bd/stimulus057.wav', 'audio/bd/stimulus058.wav', 'audio/bd/stimulus059.wav', 'audio/bd/stimulus060.wav', 'audio/bd/stimulus061.wav', 'audio/bd/stimulus062.wav', 'audio/bd/stimulus063.wav', 'audio/bd/stimulus064.wav', 'audio/bd/stimulus065.wav', 'audio/bd/stimulus066.wav', 'audio/bd/stimulus067.wav', 'audio/bd/stimulus068.wav', 'audio/bd/stimulus069.wav', 'audio/bd/stimulus070.wav', 'audio/bd/stimulus071.wav', 'audio/bd/stimulus072.wav', 'audio/bd/stimulus073.wav', 'audio/bd/stimulus074.wav', 'audio/bd/stimulus075.wav', 'audio/bd/stimulus076.wav', 'audio/bd/stimulus077.wav', 'audio/bd/stimulus078.wav', 'audio/bd/stimulus079.wav', 'audio/bd/stimulus080.wav', 'audio/bd/stimulus081.wav', 'audio/bd/stimulus082.wav', 'audio/bd/stimulus083.wav', 'audio/bd/stimulus084.wav', 'audio/bd/stimulus085.wav', 'audio/bd/stimulus086.wav', 'audio/bd/stimulus087.wav', 'audio/bd/stimulus088.wav', 'audio/bd/stimulus089.wav', 'audio/bd/stimulus090.wav', 'audio/bd/stimulus091.wav', 'audio/bd/stimulus092.wav', 'audio/bd/stimulus093.wav', 'audio/bd/stimulus094.wav', 'audio/bd/stimulus095.wav', 'audio/bd/stimulus096.wav', 'audio/bd/stimulus097.wav', 'audio/bd/stimulus098.wav', 'audio/bd/stimulus099.wav', 'audio/bd/stimulus100.wav',
	'audio/dn/001.wav', 'audio/dn/002.wav', 'audio/dn/003.wav', 'audio/dn/004.wav', 'audio/dn/005.wav', 'audio/dn/006.wav', 'audio/dn/007.wav', 'audio/dn/008.wav', 'audio/dn/009.wav', 'audio/dn/010.wav', 'audio/dn/011.wav', 'audio/dn/012.wav', 'audio/dn/013.wav', 'audio/dn/014.wav', 'audio/dn/015.wav', 'audio/dn/016.wav', 'audio/dn/017.wav', 'audio/dn/018.wav', 'audio/dn/019.wav', 'audio/dn/020.wav', 'audio/dn/021.wav', 'audio/dn/022.wav', 'audio/dn/023.wav', 'audio/dn/024.wav', 'audio/dn/025.wav', 'audio/dn/026.wav', 'audio/dn/027.wav', 'audio/dn/028.wav', 'audio/dn/029.wav', 'audio/dn/030.wav', 'audio/dn/031.wav', 'audio/dn/032.wav', 'audio/dn/033.wav', 'audio/dn/034.wav', 'audio/dn/035.wav', 'audio/dn/036.wav', 'audio/dn/037.wav', 'audio/dn/038.wav', 'audio/dn/039.wav', 'audio/dn/040.wav', 'audio/dn/041.wav', 'audio/dn/042.wav', 'audio/dn/043.wav', 'audio/dn/044.wav', 'audio/dn/045.wav', 'audio/dn/046.wav', 'audio/dn/047.wav', 'audio/dn/048.wav', 'audio/dn/049.wav', 'audio/dn/050.wav', 'audio/dn/051.wav', 'audio/dn/052.wav', 'audio/dn/053.wav', 'audio/dn/054.wav', 'audio/dn/055.wav', 'audio/dn/056.wav', 'audio/dn/057.wav', 'audio/dn/058.wav', 'audio/dn/059.wav', 'audio/dn/060.wav', 'audio/dn/061.wav', 'audio/dn/062.wav', 'audio/dn/063.wav', 'audio/dn/064.wav', 'audio/dn/065.wav', 'audio/dn/066.wav', 'audio/dn/067.wav', 'audio/dn/068.wav', 'audio/dn/069.wav', 'audio/dn/070.wav', 'audio/dn/071.wav', 'audio/dn/072.wav', 'audio/dn/073.wav', 'audio/dn/074.wav', 'audio/dn/075.wav', 'audio/dn/076.wav', 'audio/dn/077.wav', 'audio/dn/078.wav', 'audio/dn/079.wav', 'audio/dn/080.wav', 'audio/dn/081.wav', 'audio/dn/082.wav', 'audio/dn/083.wav', 'audio/dn/084.wav', 'audio/dn/085.wav', 'audio/dn/086.wav', 'audio/dn/087.wav', 'audio/dn/088.wav', 'audio/dn/089.wav', 'audio/dn/090.wav', 'audio/dn/091.wav', 'audio/dn/092.wav', 'audio/dn/093.wav', 'audio/dn/094.wav', 'audio/dn/095.wav', 'audio/dn/096.wav', 'audio/dn/097.wav', 'audio/dn/098.wav', 'audio/dn/099.wav', 'audio/dn/100.wav',
	'audio/mn/001.wav', 'audio/mn/002.wav', 'audio/mn/003.wav', 'audio/mn/004.wav', 'audio/mn/005.wav', 'audio/mn/006.wav', 'audio/mn/007.wav', 'audio/mn/008.wav', 'audio/mn/009.wav', 'audio/mn/010.wav', 'audio/mn/011.wav', 'audio/mn/012.wav', 'audio/mn/013.wav', 'audio/mn/014.wav', 'audio/mn/015.wav', 'audio/mn/016.wav', 'audio/mn/017.wav', 'audio/mn/018.wav', 'audio/mn/019.wav', 'audio/mn/020.wav', 'audio/mn/021.wav', 'audio/mn/022.wav', 'audio/mn/023.wav', 'audio/mn/024.wav', 'audio/mn/025.wav', 'audio/mn/026.wav', 'audio/mn/027.wav', 'audio/mn/028.wav', 'audio/mn/029.wav', 'audio/mn/030.wav', 'audio/mn/031.wav', 'audio/mn/032.wav', 'audio/mn/033.wav', 'audio/mn/034.wav', 'audio/mn/035.wav', 'audio/mn/036.wav', 'audio/mn/037.wav', 'audio/mn/038.wav', 'audio/mn/039.wav', 'audio/mn/040.wav', 'audio/mn/041.wav', 'audio/mn/042.wav', 'audio/mn/043.wav', 'audio/mn/044.wav', 'audio/mn/045.wav', 'audio/mn/046.wav', 'audio/mn/047.wav', 'audio/mn/048.wav', 'audio/mn/049.wav', 'audio/mn/050.wav', 'audio/mn/051.wav', 'audio/mn/052.wav', 'audio/mn/053.wav', 'audio/mn/054.wav', 'audio/mn/055.wav', 'audio/mn/056.wav', 'audio/mn/057.wav', 'audio/mn/058.wav', 'audio/mn/059.wav', 'audio/mn/060.wav', 'audio/mn/061.wav', 'audio/mn/062.wav', 'audio/mn/063.wav', 'audio/mn/064.wav', 'audio/mn/065.wav', 'audio/mn/066.wav', 'audio/mn/067.wav', 'audio/mn/068.wav', 'audio/mn/069.wav', 'audio/mn/070.wav', 'audio/mn/071.wav', 'audio/mn/072.wav', 'audio/mn/073.wav', 'audio/mn/074.wav', 'audio/mn/075.wav', 'audio/mn/076.wav', 'audio/mn/077.wav', 'audio/mn/078.wav', 'audio/mn/079.wav', 'audio/mn/080.wav', 'audio/mn/081.wav', 'audio/mn/082.wav', 'audio/mn/083.wav', 'audio/mn/084.wav', 'audio/mn/085.wav', 'audio/mn/086.wav', 'audio/mn/087.wav', 'audio/mn/088.wav', 'audio/mn/089.wav', 'audio/mn/090.wav', 'audio/mn/091.wav', 'audio/mn/092.wav', 'audio/mn/093.wav', 'audio/mn/094.wav', 'audio/mn/095.wav', 'audio/mn/096.wav', 'audio/mn/097.wav', 'audio/mn/098.wav', 'audio/mn/099.wav', 'audio/mn/100.wav'
	];

	//now that we have complete timeline, we tell jsPsych to run it.
	//We will eventually need a JATOS wrapper
	
	jatos.onLoad(
		jatos.addJatosIds(resultData),
		
		jsPsych.init({
			timeline: timeline,
			
			exclusions: {
          	  min_width: 800,
          	  min_height: 600
        },
        on_interaction_data_update: function (data) {
            if (data.event == "blur") {
                console.log(data);
                blur_count++;
                if (blur_count > 10) {
                    likely_invalid = true;
                }
            };
        },
        
			use_webaudio: false,
			preload_audio: audio,
			
			//to display data and add subject number:
			on_finish: function() {
				var studyID = jatos.studyResultID;
				 if(likely_invalid){
                	studyID += ' - invalid result'
            }
				jsPsych.data.addProperties({subject : studyID});
				// jsPsych.data.displayData("CSV");
				//to submit the results to JATOS...
        	    var all_data = jsPsych.data.get();
        	    var results = all_data.ignore('internal_node_id').ignore('time_elapsed');
            	jatos.submitResultData(results.csv(), jatos.startNextComponent);
			}
		})
	);
