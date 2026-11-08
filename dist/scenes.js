export const fusionMilestones=['Repeatable ignition','Chamber durability','Pilot power generation','Commercial deployment'];
// Scroll distances are expressed in viewport heights, not seconds.
const fusionScenes=[
 {asset:'stage',chapter:0,kind:'stage',units:1.1,title:'Paige',description:'A story about possibility.'},
 {asset:'quarks',chapter:1,kind:'micro',units:.8,eyebrow:'01 / The science',title:'Start with the smallest pieces.',description:'Quarks interact through the strong force. Here, three are visualized inside a proton.'},
 {asset:'proton',chapter:1,kind:'micro',units:.65,eyebrow:'From interactions to matter',title:'A proton.',description:'A tiny constituent of an atomic nucleus.'},
 {asset:'neutron',chapter:1,kind:'micro',units:.65,eyebrow:'The nucleus takes shape',title:'And a neutron.',description:'Together, a proton and a neutron form a deuterium nucleus.'},
 {asset:'deuterium',chapter:1,kind:'micro',units:.85,eyebrow:'Deuterium / ²H',title:'One atom. A much bigger possibility.',description:'Deuterium is an isotope of hydrogen. Its atom has one proton, one neutron, and one electron.'},
 {asset:'dt-before',chapter:1,kind:'micro',units:.75,eyebrow:'Deuterium + tritium',title:'Under extraordinary conditions…',description:'In a hot plasma, electrons are separated from nuclei. Deuterium and tritium nuclei can fuse.'},
 {asset:'dt-during',chapter:1,kind:'micro',units:.55,eyebrow:'D–T fusion',title:'A reaction releases energy.',description:'Two light nuclei combine and rearrange.'},
 {asset:'dt-after',chapter:1,kind:'micro',units:.75,eyebrow:'Helium-4 + neutron',title:'The products move apart.',description:'A helium nucleus and a neutron carry away the released energy.'},
 {asset:'reactor',chapter:1,units:.85,eyebrow:'From one event to a system',title:'Imagine harnessing that reaction.',description:'Laser beams compress and heat a tiny fuel target. A power plant would need to repeat this process reliably.'},
 {asset:'heat',chapter:1,units:.7,eyebrow:'Capturing the energy',title:'Fusion energy becomes heat.',description:'A surrounding blanket captures energy carried by neutrons; a cooling system carries heat toward a power cycle.'},
 {asset:'turbine',chapter:1,units:.7,eyebrow:'Heat → electricity',title:'Heat drives a turbine.',description:'The turbine turns a generator, converting that energy into electricity.'},
 {asset:'power',chapter:2,units:.8,eyebrow:'02 / One possible future',title:'Power reaches beyond the plant.',description:'An imagined fusion company supplies electricity to businesses and communities.'},
 {asset:'quantum-arrival',chapter:2,units:.85,eyebrow:'Energy enables possibility',title:'Including a quantum computing company.',description:'Reliable electricity supports the cooling, control systems, and infrastructure around quantum hardware.'},
 {asset:'quantum-campus',chapter:2,kind:'closing',units:1,eyebrow:'A vision, not a forecast',title:'One Possible Future',description:''},
 {asset:'quantum-campus',chapter:3,kind:'closing',units:1.1,eyebrow:'03 / Building that future',title:'What would it take to build this?',description:''},
 {asset:'fusion-campus',chapter:3,units:.65,eyebrow:'Return to the fusion company',title:'Begin with the physical system.',description:'The vision depends on an engineered facility that can operate reliably.'},
 {asset:'fusion-outline',chapter:3,units:.65,eyebrow:'Designing the company',title:'A possibility becomes a plan.',description:'The reactor, lasers, cooling systems, and grid connection all have to work together.'},
 {asset:'fusion-paper',chapter:3,kind:'paper',units:.75,eyebrow:'From architecture to decisions',title:'Put the plan on paper.',description:'Define what must be built—and what must still be demonstrated.'},
 {asset:'fusion-model',chapter:3,kind:'paper',units:1.1,eyebrow:'Funding the path forward',title:'What would it cost to build a fusion plant?',description:'The model starts with $2B for research and $6B to build the plant. Follow the milestones to see what each investment must prove before the next one makes sense.'},
 {asset:'fusion-ignition',chapter:3,units:.8,timeline:'fusion',step:0,crop:.755,eyebrow:'Illustrative budget · $1.4B laser and target R&D',title:'Repeatable ignition',description:'Can the lasers ignite targets repeatedly? The model puts $800M into lasers and $600M into targets to test that first hurdle.'},
 {asset:'fusion-durability',chapter:3,units:.8,timeline:'fusion',step:1,crop:.785,eyebrow:'Illustrative budget · $600M materials R&D',title:'Chamber durability',description:'Can the chamber withstand repeated shots? The $600M materials budget tests component life and how often repairs would interrupt power sales.'},
 {asset:'fusion-pilot',chapter:3,units:.85,timeline:'fusion',step:2,crop:.77,eyebrow:'Illustrative installed cost · $1.2B turbine and cooling',title:'Pilot power generation',description:'Can a pilot deliver usable electricity? The model allocates $1.2B to turbines and cooling. Measured net output would inform the decision to scale.'},
 {asset:'fusion-commercial',chapter:3,units:.9,timeline:'fusion',step:3,crop:.77,eyebrow:'Illustrative plant cost · $6B total',title:'Commercial deployment',description:'Can reliable output support a $6B plant? At 80% utilization, 1,000 MW and $100/MWh imply about $701M in annual sales before expenses.'},
 {asset:'fusion-campus',chapter:4,kind:'closing',units:1.45,eyebrow:'04 / My intersection',title:'This is one possible technological future. Reaching it requires scientific progress, engineering—and investment informed by both.',description:''},
 {asset:'fusion-campus',chapter:4,kind:'closing',units:1.45,eyebrow:'Paige / Physics + finance',title:'I want to work at that intersection—understanding emerging technologies and evaluating how they could become viable businesses.',description:''},
 {asset:'fusion-campus',chapter:4,kind:'dissolve',units:.85,title:'',description:''}
];

export const quantumMilestones=['Validated qubit performance','Error-corrected prototype','Scalable system','Commercial deployment'];
const quantumScience=[
 {asset:'yb-ion-v2',kind:'quantum-science',title:'A different atom. A different possibility.',eyebrow:'Ytterbium-171 / ¹⁷¹Yb⁺',description:'70 protons, 101 neutrons, and 69 electrons. Removing one electron leaves a positively charged ion. The ivory protons and blue-gray neutrons form a much larger nucleus. Illustration not to scale.'},
 {asset:'ion-trap-v2',kind:'quantum-science',title:'Hold an atom without touching it.',eyebrow:'An electromagnetic trap',description:'Electric fields confine the ions in a vacuum. Lasers cool their motion so they can be controlled precisely.'},
 {asset:'ion-trap-v2',kind:'quantum-science',title:'Two states become one qubit.',eyebrow:'Information inside an ion',description:'Two internal energy states encode 0 and 1. A controlled pulse can prepare a superposition. Measurement returns one result, with probabilities set by that state.',interaction:'qubit'},
 {asset:'ion-chain-v2',kind:'quantum-science',title:'Let the qubits work together.',eyebrow:'From one ion to a processor',description:'Laser-driven interactions use the ions’ shared motion to entangle qubits. Repeated checks and error correction are needed to protect a longer computation.'},
 {asset:'quantum-campus',title:'Build a company around the science.',eyebrow:'02 / One possible future',description:'A quantum computing company brings together processors, control electronics, software, and people.',chapter:2},
 {asset:'fusion-campus',title:'Powered by a fusion company.',eyebrow:'Electricity flows into this future',description:'In this imagined future, a fusion plant supplies electricity to the quantum company’s lasers, controls, cooling, and facilities. Quantum computers do not require fusion power.',chapter:2},
 {asset:'quantum-campus',title:'One Possible Future',description:'',eyebrow:'A vision, not a forecast',chapter:2,kind:'closing'},
 {asset:'quantum-paper-v2',kind:'architecture',title:'What would it take to build this?',description:'Start with the processor. Then fund the engineering that makes it reliable, scalable, and useful.',eyebrow:'03 / Building that future',chapter:3},
 {asset:'quantum-model',title:'A quantum company, on paper.',description:'',chapter:3,kind:'ledger',ledger:'quantum'},
 ...quantumMilestones.map((title,step)=>({asset:['ion-trap-v2','ion-chain-v2','quantum-lab','quantum-campus-v2'][step],kind:'quantum-milestone',title,step,timeline:'quantum',chapter:3,eyebrow:['First: demonstrate reliable control','Then: protect quantum information','Next: scale the complete system','Finally: prove customer value'][step],description:['Prepare, control, and measure qubits repeatedly. Measure error rates before expanding the hardware.','Combine physical qubits into an error-corrected prototype. Test whether protection reduces errors in the encoded information.','Expand the trap, optics, controls, and software while preserving performance. More physical qubits alone do not prove a scalable computer.','Show a useful result at a cost customers will pay. Technical milestones and commercial demand must both hold up.'][step]}))
].map(s=>({chapter:1,kind:'full',units:.9,...s}));
export function createScenes(route='fusion') {
 const shared=fusionScenes.slice(0,4).map(s=>({...s}));
 shared[3].description='Protons and neutrons help make atomic nuclei. From here, choose which possibility to explore.';
 shared[3].choice=true;
 const ending=fusionScenes.slice(-3).map(s=>({...s,asset:route==='quantum'?'quantum-campus':s.asset}));
 const middle=route==='quantum'?quantumScience:fusionScenes.slice(4,-3).map(s=>s.asset==='fusion-model'?{...s,kind:'ledger',ledger:'fusion'}:s);
 return [...shared,...middle,...ending].map(s=>s.asset==='fusion-paper'?{...s,asset:'fusion-paper-v2',kind:'architecture'}:s.asset==='quantum-campus'?{...s,asset:'quantum-campus-v2'}:s);
}
export const scenes=createScenes();
