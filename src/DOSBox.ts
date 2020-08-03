import { Uri,FileSystem, OutputChannel,workspace, window, DiagnosticSeverity} from 'vscode'
import { TextEncoder } from 'util'
import { Config } from './configration'
import {exec,execSync} from 'child_process'
import { landiagnose } from './diagnose'
export class DOSBox{
    private _OutChannel:OutputChannel
    constructor(Channel:OutputChannel){
        this._OutChannel=Channel
    }
    /**打开dosbox,操作文件
     * @param conf 配置文件
     * @param more 需要执行的额外命令
     * @param bothtools 为true将MASM和TASM都挂载到path中，并删除T.*复制相应文件到此处
     */
    public openDOSBox(conf:Config,more:string,bothtools?:boolean,diag?:landiagnose) {
        let filename=window.activeTextEditor?.document.fileName
        if (filename){
            this.writeBoxconfig(more,conf,bothtools)
            if(bothtools)this.cleanandcopy(conf.path,filename)
            if(process.platform=='win32'){
                execSync('start/min/wait "" "dosbox/dosbox.exe" -conf "dosbox/VSC-ExtUse.conf" ',{cwd:conf.path,shell:'cmd.exe'})
            }
            else{
                execSync('dosbox -conf "dosbox/VSC-ExtUse.conf" ',{cwd:conf.path})
            }
            if(diag) this.BOXdiag(conf,diag)
            this._OutChannel.appendLine("已打开DOSBox，并配置汇编环境")
        }   
    }
    private BOXdiag(conf:Config,diag:landiagnose):string{
        let info:string=' ',content
        let infouri=Uri.file(conf.path + '/work/T.TXT');
        let turi=window.activeTextEditor?.document.uri
        let texturi:Uri
        if (turi) {
            texturi=turi
            workspace.fs.readFile(infouri).then(
            (text)=>{
                info=text.toString()
                workspace.fs.readFile(texturi).then(
                    (text)=>{
                        content=text.toString()
                        diag.ErrMsgProcess(content,info,texturi,conf.MASMorTASM)
                        this._OutChannel.append(info)
                    }
                )
            },
            ()=>{console.log(infouri,'readfailed')}
        )}
        return info
    }
    private cleanandcopy(cleanpath:string,copyfilename:string){
        if(process.platform=='win32'){
            exec('  del work\\T.* && copy "'+copyfilename+'" work\\T.ASM',{cwd:cleanpath,shell:'cmd.exe'});
        }
        else{
            exec('  rm work/T.* ; cp "'+copyfilename+'" work/T.ASM',{cwd:cleanpath});
        }
        this._OutChannel.appendLine(copyfilename+'已将该文件复制到'+cleanpath+'work/T.ASM');
     }
    private writeBoxconfig(autoExec: string,conf:Config,bothtool?:boolean)
    {
        let fs: FileSystem = workspace.fs;
        let configUri:Uri = Uri.file(conf.path + '/dosbox/VSC-ExtUse.conf');
        if(process.platform=='win32')configUri=Uri.joinPath(conf.toolsUri,'./dosbox/VSC-ExtUse.conf');
        let Pathadd=' '
        if (bothtool) Pathadd='set PATH=c:\\tasm;c:\\masm'
        const configContent = `[sdl]
windowresolution=${conf.resolution}
output=opengl
[autoexec]
mount c "${conf.path}"
mount d "${conf.path}/work"
d:
${Pathadd}
${autoExec}`;
        fs.writeFile(configUri, new TextEncoder().encode(configContent));
    }
}



