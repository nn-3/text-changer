function textChanger(dflt,opt) {

let on = 'addEventListener';
let $d = document;
let $id = id => (id instanceof HTMLElement)?id:$d.getElementById(id);
let tc = textChanger;

let set = Object.assign({
	setBtnId: 'changeSet',
	clrBtnId: 'changeClr',
	areaId: null,
	btnEvent: null,
	storage: 'session',
	path: 'textChanger',
	attr: 'data-text',
	word: 'default'
},opt||{});
let keys = Object.keys(dflt);
let data = Object.create(dflt);
let storage, sF = set.storage!==null;
if(sF) {
	storage = window[set.storage+'Storage']||window.sessionStorage;
	data = Object.assign(data,JSON.parse(storage.getItem(set.path))||{});
}
function setting(){
	let $area = $id(set.areaId)||$d.body;
	let $set = $id(set.setBtnId);
	let $clr = $id(set.clrBtnId);
	let $list = {};
	let bET = typeof set.btnEvent;
	let bF = !!$set||!!$clr;
	let iF = false;
	let lF = bF && (bET=='function'||!sF);
	let nF = Array.isArray(tc.nodes);
	for(let k of keys){
		$list[k] = {};
		if(lF) $list[k].node = [];
	}
	$d.querySelectorAll('['+set.attr+']').forEach($e=>{
		let k = $e.getAttribute(set.attr);
		if(keys.indexOf(k)<0) return;
		if($e.tagName=='INPUT'){
			if(!bF) return;
			$e.value = data[k];
			$list[k].input = $e;
			iF = true;
		} else {
			$e.textContent = data[k];
			if(lF) $list[k].node.push($e.childNodes[0]);
			if(nF) tc.nodes.push($e.childNodes[0]);
		}
	});
	if(!!set.word) {
		let t = set.word.match(/key|default/);
		if(t){
			let regEsc = str => str.replace(/[\-\/\|^$*+?.(){}\[\]]/g,'\x5c$&');
			let wP = (e,k) => {w[e]=k;reg+=(reg.length?'|':'')+regEsc(e)};
			let w={},reg='';
			let rTN, rTNs = $elm =>{
				let ns = Array.from($elm.childNodes);
				for(let n of ns){
					if(n.nodeType==1&&!n.matches('script,['+set.attr+'],.no-change')) rTNs(n);
					else if(n.nodeType==3) rTN(n);
				}
			}
			if(t[0]=='key') for(let k of keys) wP(k,k);
			else for(let k of keys) wP(dflt[k],k);
			reg = regEsc(set.word).replace(t[0],'('+reg+')');
			if(lF||nF) {
				reg = RegExp(reg);
				rTN = n =>{
					if(nF&&tc.nodes.includes(n)) return;
					let m = n.nodeValue.match(reg);
					if(!!m){
						let l = m.index+m[0].length;
						if(m.input.length!=l) rTN(n.splitText(l));
						let nn = !m.index?n:n.splitText(m.index);
						if(lF) $list[w[m[1]]].node.push(nn);
						if(nF) tc.nodes.push(nn);
						nn.nodeValue = data[w[m[1]]];
					}
				}
			} else {
				reg = RegExp(reg,'g');
				let rep = (s,k) => data[w[k]]||s;
				rTN = n => n.nodeValue = n.nodeValue.replace(reg,rep);
			}
			rTNs($area);
		}
	}
	if(iF&&bF){
		let iEach = fnc =>{
			for(let k of keys) if(!!$list[k].input) fnc(k,$list[k].input);
		}
		let sSet = sF?()=>{
			if(Object.keys(data).length) storage.setItem(set.path,JSON.stringify(data));
			else storage.removeItem(set.path);
		}:()=>{};
		let bEv = lF?(type,obj)=>{
			iEach((k,$i)=>{
				$i.value = obj[k];
				$list[k].node.forEach(n=>n.nodeValue=obj[k]);
			});
			if(bET=='function') set.btnEvent(type,data,dflt);
		}:bET=='string'?()=>{location.href=set.btnEvent}:()=>{location.reload()};
		if(!!$set) {
			$set[on]('click',()=>{
				iEach((k,$i)=>data[k]=$i.value);
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

if($d.readyState=='loading') $d[on]('DOMContentLoaded',setting);
else setting();

}
