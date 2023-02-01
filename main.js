function textChanger(dflt,opt) {

let on = 'addEventListener';
let $d = document;
let $id = id => (id instanceof HTMLElement)?id:$d.getElementById(id);

let set = Object.assign({
	setBtnId: 'changeSet',
	clrBtnId: 'changeClr',
	btnEvent: null,
	storage: 'session',
	path: 'textChanger',
	attr: 'data-text',
	word: 'default'
},opt||{});
let keys = Object.keys(dflt);
let data = Object.create(dflt);
let storage, sFlg = set.storage!==null;
if(sFlg) {
	storage = window[set.storage+'Storage']||window.sessionStorage;
	data = Object.assign(data,JSON.parse(storage.getItem(set.path))||{});
}
function setting(){
	let $area = $id(set.areaId)||$d.body;
	let $set = $id(set.setBtnId);
	let $clr = $id(set.clrBtnId);
	let $list = {};
	let bET = typeof set.btnEvent;
	let lFlg = (!!$set||!!clr) && (bET=='function'||!sFlg);
	for(let k of keys){
		$list[k] = {};
		if(lFlg) $list[k].node = [];
	}
	$d.querySelectorAll('['+set.attr+']').forEach($e=>{
		let k = $e.getAttribute(set.attr);
		if(keys.indexOf(k)<0) return;
		if($e.tagName=='INPUT'){
			$e.value = data[k];
			$list[k].input = $e;
		} else {
			$e.textContent = data[k];
			if(lFlg) $list[k].node.push($e.childNodes[0]);
		}
	});
	if(set.word && /key|default/.test(set.word)) {
		let regEsc = str => str.replace(/[\-\/\\|^$*+?.(){}\[\]]/g,'\x5c$&');
		let w={},esc=[],r;
		if(0<=set.word.indexOf('key')){
			for(let k of keys) {
				w[k] = k;
				esc.push(regEsc(k));
			}
			r = /key/;
		} else {
			for(let k of keys) {
				w[dflt[k]] = k;
				esc.push(regEsc(dflt[k]));
			}
			r = /default/;
		}
		let reg = RegExp(regEsc(set.word).replace(r,'('+esc.join('|')+')'),lFlg?'':'g');
		let rTN, rTNs = $elm =>{
			let ns = Array.from($elm.childNodes);
			for(let n of ns){
				if(n.nodeType==1&&!n.tagName!='script') rTNs(n);
				else if(n.nodeType==3) rTN(n);
			}
		}
		if(lFlg) {
			rTN = n =>{
				let m = n.nodeValue.match(reg);
				if(!!m){
					let k = w[m[1]];
					let l = m.index+m[0].length;
					if(m.input.length!=l) rTN(n.splitText(l));
					let nn = !m.index?n:n.splitText(m.index);
					$list[k].node.push(nn);
					nn.nodeValue = data[k];
				}
			}
		} else {
			let rep = (s,k) => data[w[k]]||s;
			rTN = n => n.nodeValue = n.nodeValue.replace(reg,rep);
		}
		rTNs($area);
	}
	if(!!set||!!clr){
		let iEach = fnc =>{
			for(let k of keys) if(!!$list[k].input) fnc(k,$list[k].input);
		}
		let sSet = sFlg?()=>{
			if(Object.keys(data).length) storage.setItem(set.path,JSON.stringify(data));
			else storage.removeItem(set.path);
		}:()=>{};
		let bEv = lFlg?(type,obj)=>{
			iEach((k,$i)=>{
				$i.value = obj[k];
				$list[k].node.forEach(n=>n.nodeValue=obj[k]);
			});
			if(bET=='function') set.btnEvent(type,data,dflt);
		}:bET=='string'?()=>{location.href=set.btnEvent}:()=>{location.reload()};
		if(!!$set) {
			$set[on]('click',()=>{
				iEach((k,$i)=>data[k]=$i.value)
				sSet();
				bEv('set',data);
			});
		};
		if(!!$clr) {
			$clr[on]('click',()=>{
				iEach(k=>delete data[k]);
				sSet();
				bEv('clr',dflt);
			});
		}
	}
}

if($d.readyState=='loading') {
	$d[on]('DOMContentLoaded',setting);
} else {
	setting();
}

}
