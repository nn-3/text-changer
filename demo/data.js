textChanger({
		'姓':'見本',
		'名':'例子'
	},{
		btnEvent:t=>{
			let $pop = document.createElement('div');
			let flg = false;
			$pop.classList.add('popup');
			$pop.textContent = `設定を${t=='set'?'変更':'初期化'}しました`;
			document.body.appendChild($pop);
			$pop.addEventListener('animationend',e=>{
				if(!flg) flg = true;
				else document.body.removeChild($pop);
			});
		}
});
