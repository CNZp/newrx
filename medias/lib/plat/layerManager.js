//通用业务逻辑
var zpid;                      //用于图片空间
var workFlowType = "layer";  //工作流弹出风格
var hasHandleSubmit = true; //是否有下一环节办理人提示页面
var workflowShowSpx = true;   //工作流配置，是否在表单中自动生成审批意见。1、表单中需要使用相关方法。 2、工作流活动节点进行相关配置
var isWorkflowSign = true;//双击工作流列表时是否签收确认 true：需要确认 false：不需确认（默认签收）

function getWorkflowType(){
    return workFlowType;
}

function setWorkflowType(value){
    workFlowType = value;
}

function setZpid(c) {
    zpid = c;
}
function getZpid() {
    return zpid;
}

window.property = null;      //工作流设计器属性缓存

function setNodeValue(nodeInfo, ifrWin) {
    window.property = nodeInfo;
}

function getNodeValue() {
    return property;
}

function currentNode() {
    return property;
}

// layer.config({
//     extend: 'extend/layer.ext.js'
// });
