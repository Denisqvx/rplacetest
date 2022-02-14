import { useEffect, useState } from 'react';
import { 
    StyleSheet, View, Text, Button, Platform,
    Modal, TouchableHighlight, TouchableWithoutFeedback
} from 'react-native';
import { io } from 'socket.io-client';

var mySocket = io('http://192.168.1.38:3000');

export default
function AspectGrid() {
    const [LayoutH, setLayoutH] = useState();
    const [LayoutW, setLayoutW] = useState();

    return(
        <View style={{height: '100%',width: '100%'}}>
            <View style={{height: '100%',width: '100%', position: 'absolute'}}
                onLayout={e => {
                    setLayoutH(e.nativeEvent.layout.height);
                    setLayoutW(e.nativeEvent.layout.width);
            }}>
                <View style={{
                    width:LayoutH>LayoutW ? LayoutW : LayoutH,
                    height:LayoutH>LayoutW ? LayoutW : LayoutH,
                    left: LayoutH && LayoutW && LayoutH<LayoutW ? (LayoutW-LayoutH)/2 : 0,
                    top:LayoutH && LayoutW && LayoutH>LayoutW ? (LayoutH-LayoutW)/2: 0,
                }}>
                    <Grid/>
                </View>
            </View>
        </View>
    );
}

function Grid() {
    const styles = StyleSheet.create({
        container: {
            height:'100%',
            width:'100%',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        },
        row: {
            flex:1,
            width:'100%',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
      });
    const dim = 10;

    return (
        <View style={styles.container}>
            {Array.from({ length: dim }, (_,k) =>
                <View style={styles.row}>
                    {Array.from({ length: dim }, (__,i) => <ColorBox boxid={i+k*dim}/>)}
                </View>
            )}
        </View>
    );
}

function ColorBox(props){
    const [modal, setModal] = useState(false);
    const [color, setColor] = useState(props.color??'white');

    mySocket.on('gridupdate',(prop)=>{
        if(prop.id === props.boxid) setColor(prop.color);
    });

    const styles = StyleSheet.create({
        box: Object.assign({},{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            borderColor: 'rgba(255, 0, 0, .8)',
            borderWidth: 1,
        },Platform.OS==='web'? {cursor:'pointer'}:null),
        modalholder:{
            flex:1,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor:'rgba(186, 255, 205, .7)',
        },
        modalbox:{
            alignItems:'center',
            justifyContent:'center',
            width: '70%',
            backgroundColor: '#c4c1c0',
            borderRadius: 10,
        }
      });
    
    const myModalProp =
        <Modal animationType='fade' transparent={true} visible={modal}>
            <View style={styles.modalholder}>
                <View style={styles.modalbox}>
                    <ModalColorPick colorPick={setColor} boxid={props.boxid}/>
                    
                        <View style={{width:'80%', alignItems:'flex-end'}}>
                            <Button onPress={()=>setModal(false)} title="Close"/>
                        </View>
                </View>
            </View>
            {Platform.OS==='web'?null:<Button onPress={()=>setModal(false)} title="Close"/>}
        </Modal>;
    
    return (
        <View style={[styles.box, {backgroundColor: color,}]}>
            <TouchableHighlight style={{width:'100%', height:'100%'}} onPress={()=>setModal(true)}>
                {myModalProp}
            </TouchableHighlight>
        </View>
    );
}

function ModalColorPick(props){
    const styles = StyleSheet.create({
        row: {
            flex:1,
            width:'100%',
            minHeight:60,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor:'#808080',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
        },
        colorPick: Object.assign({},{
            height:'100%',
            flexGrow:1,
        },Platform.OS==='web'? {cursor:'pointer'}:null),
    });
    
    const boxColors=[
        '#FFFFFF',
        '#E4E4E4',
        '#888888',
        '#222222',
        '#FFA7D1',
        '#E50000',
        '#E59500',
        '#A06A42',
        '#E5D900',
        '#94E044',
        '#02BE01',
        '#00D3DD',
        '#0083C7',
        '#0000EA',
        '#CF6EE4',
        '#820080'
    ];

    return(
        <View style={styles.row}>
            {Array.from(boxColors, (c,i) =>
                <TouchableWithoutFeedback underlayColor={c} onPress={()=>{
                    //props.colorPick(boxColors[i]);
                    mySocket.emit('boxchange',{color:boxColors[i],id:props.boxid});
                }}
                style={[styles.colorPick,
                    i===0?{borderTopLeftRadius:10,}:null,
                    i===boxColors.length-1?{borderTopRightRadius:10,}:null,
                ]}>
                    <View style={[styles.colorPick,{backgroundColor:c,},
                        i===0?{borderTopLeftRadius:10,}:null,
                        i===boxColors.length-1?{borderTopRightRadius:10,}:null,
                    ]}><Text/>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
}