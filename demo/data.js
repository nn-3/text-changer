
document.addEventListener('animationend',e=>{
	let $pop = e.target;
	if(!$pop.classList.contains('popup')) return;
	if($pop.dataset.visible=='1') document.body.removeChild($pop);
	else $pop.dataset.visible = '1';
});
let pop = t =>{
	let $pop = document.createElement('div');
	$pop.classList.add('popup');
	$pop.textContent = `設定を${t=='set'?'変更':'初期化'}しました`;
	document.body.appendChild($pop);
}

textChanger({
	'姓':　'見本',
	'名':　'例子'
},{btnEvent:　pop});
