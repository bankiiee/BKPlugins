FR_FARM_ORG.prototype = new BaseBo();
function FR_FARM_ORG(){
	this.ORG_CODE = null ;

this.FARM_ORG = null ;


	this.ISS_AI_FLG = null ;

this.REC_AI_FLG = null ;

this.PARENT_FARM_ORG_FD = null ;

this.PARENT_FARM_ORG_MD = null ;

this.ISS_BD_WAY_TYPE = null ;

this.ISS_FD_WAY_TYPE = null ;

this.REC_MD_WAY_TYPE = null ;

this.ISS_BD_FLG = null ;

this.ISS_FD_FLG = null ;

this.LAST_USER_ID = null ;

this.LAST_UPDATE_DATE = null ;

this.ACTIVE_FLG = null ;

this.PROJECT = null ;

this.PARENT_FARM_ORG = null ;

this.MANAGEMENT_FLG = null ;

this.REC_FD_FLG = null ;

this.REC_MD_FLG = null ;

this.REC_BD_FLG = null ;

this.REF_FARM = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.NAME_LOC = null ;

this.NAME_ENG = null ;

this.FARM = null ;

this.UNIT = null ;

this.HOUSE = null ;

this.LOCATION = null ;

this.FLOCK = null ;

this.GRP = null ;

this.CANCEL_FLAG = null ;

this.CANCEL_DATE = null ;

this.USER_CREATE = null ;

this.CREATE_DATE = null ;

this.REC_AI_WAY_TYPE = null ;

this.ISS_AI_WAY_TYPE = null ;

this.PARENT_FARM_ORG_AI = null ;

this.REC_MK_FLG = null ;

this.ISS_MK_FLG = null ;

this.REC_MK_WAY_TYPE = null ;

this.ISS_MK_WAY_TYPE = null ;

this.PARENT_FARM_ORG_MK = null ;

this.ISS_MD_FLG = null ;

this.REC_FD_WAY_TYPE = null ;

this.REC_BD_WAY_TYPE = null ;

this.ISS_MD_WAY_TYPE = null ;


}

FR_FARM_ORG.prototype.getTableName = function () {
    return "FR_FARM_ORG";
}

FR_FARM_ORG.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});


	ret.push({key:'ISS_AI_FLG',val:'text'});

ret.push({key:'REC_AI_FLG',val:'text'});

ret.push({key:'PARENT_FARM_ORG_FD',val:'text'});

ret.push({key:'PARENT_FARM_ORG_MD',val:'text'});

ret.push({key:'ISS_BD_WAY_TYPE',val:'text'});

ret.push({key:'ISS_FD_WAY_TYPE',val:'text'});

ret.push({key:'REC_MD_WAY_TYPE',val:'text'});

ret.push({key:'ISS_BD_FLG',val:'text'});

ret.push({key:'ISS_FD_FLG',val:'text'});

ret.push({key:'LAST_USER_ID',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'ACTIVE_FLG',val:'text'});

ret.push({key:'PROJECT',val:'text'});

ret.push({key:'PARENT_FARM_ORG',val:'text'});

ret.push({key:'MANAGEMENT_FLG',val:'text'});

ret.push({key:'REC_FD_FLG',val:'text'});

ret.push({key:'REC_MD_FLG',val:'text'});

ret.push({key:'REC_BD_FLG',val:'text'});

ret.push({key:'REF_FARM',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'NAME_LOC',val:'text'});

ret.push({key:'NAME_ENG',val:'text'});

ret.push({key:'FARM',val:'text'});

ret.push({key:'UNIT',val:'text'});

ret.push({key:'HOUSE',val:'text'});

ret.push({key:'LOCATION',val:'text'});

ret.push({key:'FLOCK',val:'text'});

ret.push({key:'GRP',val:'text'});

ret.push({key:'CANCEL_FLAG',val:'text'});

ret.push({key:'CANCEL_DATE',val:'date'});

ret.push({key:'USER_CREATE',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'REC_AI_WAY_TYPE',val:'text'});

ret.push({key:'ISS_AI_WAY_TYPE',val:'text'});

ret.push({key:'PARENT_FARM_ORG_AI',val:'text'});

ret.push({key:'REC_MK_FLG',val:'text'});

ret.push({key:'ISS_MK_FLG',val:'text'});

ret.push({key:'REC_MK_WAY_TYPE',val:'text'});

ret.push({key:'ISS_MK_WAY_TYPE',val:'text'});

ret.push({key:'PARENT_FARM_ORG_MK',val:'text'});

ret.push({key:'ISS_MD_FLG',val:'text'});

ret.push({key:'REC_FD_WAY_TYPE',val:'text'});

ret.push({key:'REC_BD_WAY_TYPE',val:'text'});

ret.push({key:'ISS_MD_WAY_TYPE',val:'text'});


	return ret;
}





GD2_FR_GRADE.prototype = new BaseBo();
function GD2_FR_GRADE(){
	this.GRADE_CODE = null ;


	this.LAST_UPDATE_DATE = null ;

this.LAST_USER_ID = null ;

this.CREATE_DATE = null ;

this.USER_CREATE = null ;

this.DESC_ENG = null ;

this.FUNCTION = null ;

this.DESC_LOC = null ;

this.CONDITION_1 = null ;

this.CANCEL_FLAG = null ;

this.CANCEL_DATE = null ;


}

GD2_FR_GRADE.prototype.getTableName = function () {
    return "GD2_FR_GRADE";
}

GD2_FR_GRADE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'GRADE_CODE',remark:'Pk',val:'text'});


	ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_USER_ID',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'USER_CREATE',val:'text'});

ret.push({key:'DESC_ENG',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'DESC_LOC',val:'text'});

ret.push({key:'CONDITION_1',val:'text'});

ret.push({key:'CANCEL_FLAG',val:'text'});

ret.push({key:'CANCEL_DATE',val:'date'});


	return ret;
}





GD3_FR_BREEDER.prototype = new BaseBo();
function GD3_FR_BREEDER(){
	this.BREEDER = null ;

this.ORG_CODE = null ;


	this.FUNCTION = null ;

this.CONDITION_06 = null ;

this.CONDITION_05 = null ;

this.CONDITION_04 = null ;

this.USER_CREATE = null ;

this.CANCEL_FLAG = null ;

this.CONDITION_02 = null ;

this.DESC_ENG = null ;

this.DESC_LOC = null ;

this.CONDITION_01 = null ;

this.CONDITION_03 = null ;

this.CANCEL_DATE = null ;

this.CREATE_DATE = null ;

this.LAST_USER_ID = null ;

this.LAST_UPDATE_DATE = null ;


}

GD3_FR_BREEDER.prototype.getTableName = function () {
    return "GD3_FR_BREEDER";
}

GD3_FR_BREEDER.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'BREEDER',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'CONDITION_06',val:'text'});

ret.push({key:'CONDITION_05',val:'text'});

ret.push({key:'CONDITION_04',val:'text'});

ret.push({key:'USER_CREATE',val:'text'});

ret.push({key:'CANCEL_FLAG',val:'text'});

ret.push({key:'CONDITION_02',val:'numeric'});

ret.push({key:'DESC_ENG',val:'text'});

ret.push({key:'DESC_LOC',val:'text'});

ret.push({key:'CONDITION_01',val:'text'});

ret.push({key:'CONDITION_03',val:'text'});

ret.push({key:'CANCEL_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_USER_ID',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});


	return ret;
}





GENERAL_DESC.prototype = new BaseBo();
function GENERAL_DESC(){
	this.GDCODE = null ;


	this.COND4 = null ;

this.COND3 = null ;

this.COND1 = null ;

this.DESC5 = null ;

this.COND2 = null ;

this.DESC4 = null ;

this.DESC2 = null ;

this.GDTYPE = null ;

this.FUNCTION = null ;

this.COND5 = null ;

this.ENTRY_STATUS = null ;

this.ENTRY_STATUS_DATE = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;

this.DESC1 = null ;

this.DESC3 = null ;


}

GENERAL_DESC.prototype.getTableName = function () {
    return "GENERAL_DESC";
}

GENERAL_DESC.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'GDCODE',remark:'Pk',val:'text'});


	ret.push({key:'COND4',val:'text'});

ret.push({key:'COND3',val:'text'});

ret.push({key:'COND1',val:'text'});

ret.push({key:'DESC5',val:'text'});

ret.push({key:'COND2',val:'text'});

ret.push({key:'DESC4',val:'text'});

ret.push({key:'DESC2',val:'text'});

ret.push({key:'GDTYPE',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'COND5',val:'text'});

ret.push({key:'ENTRY_STATUS',val:'text'});

ret.push({key:'ENTRY_STATUS_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'DESC1',val:'text'});

ret.push({key:'DESC3',val:'text'});


	return ret;
}





HH_BO_STRUCTURE.prototype = new BaseBo();
function HH_BO_STRUCTURE(){
	this.BO_TYPE = null ;

this.PROGRAM_ID = null ;

this.DEVICE_ID = null ;

this.BUSINESS_UNIT = null ;


	this.BO_OBJECT = null ;

this.FUNCTION = null ;

this.CREATE_DATE = null ;

this.AP_VERSION = null ;

this.LAST_UPDATE_DATE = null ;

this.OWNER = null ;

this.NUMBER_OF_SENDING_DATA = null ;


}

HH_BO_STRUCTURE.prototype.getTableName = function () {
    return "HH_BO_STRUCTURE";
}

HH_BO_STRUCTURE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'BO_TYPE',remark:'Pk',val:'text'});

ret.push({key:'PROGRAM_ID',remark:'Pk',val:'text'});

ret.push({key:'DEVICE_ID',remark:'Pk',val:'numeric'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});


	ret.push({key:'BO_OBJECT',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'AP_VERSION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});


	return ret;
}





HH_CATAGORY_CONFIG.prototype = new BaseBo();
function HH_CATAGORY_CONFIG(){
	this.DOC_TYPE = null ;

this.BUSINESS_UNIT = null ;

this.COLUMN_NAME = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.LAST_OWNER = null ;

this.CREATE_DATE = null ;

this.STATUS = null ;

this.OWNER = null ;


}

HH_CATAGORY_CONFIG.prototype.getTableName = function () {
    return "HH_CATAGORY_CONFIG";
}

HH_CATAGORY_CONFIG.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'DOC_TYPE',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'COLUMN_NAME',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_CLIENT_USER_RECEIVED_BU.prototype = new BaseBo();
function HH_CLIENT_USER_RECEIVED_BU(){
	this.ORG_CODE = null ;

this.PROGRAM_ID = null ;

this.BUSINESS_UNIT = null ;

this.DEVICE_ID = null ;

this.USER_ID = null ;

this.TABLE_NAME = null ;


	this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.TOTAL_ROW_COUNT = null ;

this.LAST_DATA_TIMESTAMP = null ;

this.NO_ROW_RECEIVED = null ;

this.LAST_PK_DATA = null ;


}

HH_CLIENT_USER_RECEIVED_BU.prototype.getTableName = function () {
    return "HH_CLIENT_USER_RECEIVED_BU";
}

HH_CLIENT_USER_RECEIVED_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'PROGRAM_ID',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'DEVICE_ID',remark:'Pk',val:'numeric'});

ret.push({key:'USER_ID',remark:'Pk',val:'text'});

ret.push({key:'TABLE_NAME',remark:'Pk',val:'text'});


	ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'TOTAL_ROW_COUNT',val:'numeric'});

ret.push({key:'LAST_DATA_TIMESTAMP',val:'date'});

ret.push({key:'NO_ROW_RECEIVED',val:'numeric'});

ret.push({key:'LAST_PK_DATA',val:'text'});


	return ret;
}





HH_COMPANY_BU.prototype = new BaseBo();
function HH_COMPANY_BU(){
	this.BUSINESS_TYPE = null ;

this.BUSINESS_UNIT = null ;

this.COMPANY_CODE = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.ADDRESS2 = null ;

this.COMPANY_NAME = null ;

this.ADDRESS1 = null ;

this.TEL = null ;

this.TAX_ID = null ;

this.OWNER = null ;


}

HH_COMPANY_BU.prototype.getTableName = function () {
    return "HH_COMPANY_BU";
}

HH_COMPANY_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'BUSINESS_TYPE',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'COMPANY_CODE',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'ADDRESS2',val:'text'});

ret.push({key:'COMPANY_NAME',val:'text'});

ret.push({key:'ADDRESS1',val:'text'});

ret.push({key:'TEL',val:'text'});

ret.push({key:'TAX_ID',val:'text'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_CONNECT_LOG_BU.prototype = new BaseBo();
function HH_CONNECT_LOG_BU(){
	this.BUSINESS_UNIT = null ;

this.SESSION_ID = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.NUMBER_OF_TABLE = null ;

this.ERROR_MSG = null ;

this.OWNER = null ;

this.LAST_END_CONNECT_DATE_TIME = null ;

this.DEVICE_ID = null ;

this.PROGRAM_ID = null ;

this.USER_ID = null ;

this.LAST_START_CONNECT_DATE_TIME = null ;


}

HH_CONNECT_LOG_BU.prototype.getTableName = function () {
    return "HH_CONNECT_LOG_BU";
}

HH_CONNECT_LOG_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'SESSION_ID',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'NUMBER_OF_TABLE',val:'text'});

ret.push({key:'ERROR_MSG',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'LAST_END_CONNECT_DATE_TIME',val:'date'});

ret.push({key:'DEVICE_ID',val:'numeric'});

ret.push({key:'PROGRAM_ID',val:'text'});

ret.push({key:'USER_ID',val:'text'});

ret.push({key:'LAST_START_CONNECT_DATE_TIME',val:'date'});


	return ret;
}





HH_CONNECT_TABLE_LOG_BU.prototype = new BaseBo();
function HH_CONNECT_TABLE_LOG_BU(){
	this.SESSION_ID = null ;

this.BUSINESS_UNIT = null ;

this.TABLE_NAME = null ;


	this.ERR_MSG = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.DEVICE_ID = null ;

this.PROGRAM_ID = null ;

this.USER_ID = null ;

this.SEND_RECEIVE_FLAG = null ;

this.NUMBER_OF_ROW = null ;

this.OWNER = null ;


}

HH_CONNECT_TABLE_LOG_BU.prototype.getTableName = function () {
    return "HH_CONNECT_TABLE_LOG_BU";
}

HH_CONNECT_TABLE_LOG_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'SESSION_ID',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'TABLE_NAME',remark:'Pk',val:'text'});


	ret.push({key:'ERR_MSG',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'DEVICE_ID',val:'numeric'});

ret.push({key:'PROGRAM_ID',val:'text'});

ret.push({key:'USER_ID',val:'text'});

ret.push({key:'SEND_RECEIVE_FLAG',val:'text'});

ret.push({key:'NUMBER_OF_ROW',val:'text'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_CV_OPER.prototype = new BaseBo();
function HH_CV_OPER(){
	this.CV_CODE = null ;

this.SUB_OPERATION = null ;

this.BUSINESS_UNIT = null ;

this.COMPANY = null ;

this.OPERATION = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.LAST_OWNER = null ;

this.OWNER = null ;

this.CV_NAME = null ;

this.STATUS = null ;

this.CREATE_DATE = null ;


}

HH_CV_OPER.prototype.getTableName = function () {
    return "HH_CV_OPER";
}

HH_CV_OPER.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'CV_CODE',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CV_NAME',val:'text'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});


	return ret;
}





HH_DEVICES.prototype = new BaseBo();
function HH_DEVICES(){
	this.DEVICE_ID = null ;


	this.EXT3 = null ;

this.EXT2 = null ;

this.EXT1 = null ;

this.CURRENT_USER = null ;

this.CREATE_USER = null ;

this.DEFAULT_LANG = null ;

this.DEVICE_TYPE = null ;

this.TAG = null ;

this.MAC_ADDRESS = null ;

this.DEVICE_UID = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;

this.OWNER = null ;

this.FUNCTION = null ;


}

HH_DEVICES.prototype.getTableName = function () {
    return "HH_DEVICES";
}

HH_DEVICES.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'DEVICE_ID',remark:'Pk',val:'numeric'});


	ret.push({key:'EXT3',val:'text'});

ret.push({key:'EXT2',val:'text'});

ret.push({key:'EXT1',val:'text'});

ret.push({key:'CURRENT_USER',val:'text'});

ret.push({key:'CREATE_USER',val:'text'});

ret.push({key:'DEFAULT_LANG',val:'text'});

ret.push({key:'DEVICE_TYPE',val:'text'});

ret.push({key:'TAG',val:'text'});

ret.push({key:'MAC_ADDRESS',val:'text'});

ret.push({key:'DEVICE_UID',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'FUNCTION',val:'text'});


	return ret;
}





HH_FR_CUSTOMER_PIG.prototype = new BaseBo();
function HH_FR_CUSTOMER_PIG(){
	this.BUSINESS_UNIT = null ;

this.SUB_OPERATION = null ;

this.WAREHOUSE_CODE = null ;

this.CUSTOMER_CODE = null ;


	this.LAST_UPDATE_DATE = null ;

this.FUNCTION = null ;

this.CONTACT_PERSON = null ;

this.CUSTOMER_GROUP = null ;

this.TAX_ID = null ;

this.AREA_CODE = null ;

this.CUSTOMER_TYPE = null ;

this.OPEN_ACCOUNT_DATE = null ;

this.EMAIL = null ;

this.CUSTOMER_NAME = null ;

this.ADDRESS1 = null ;

this.ADDRESS2 = null ;

this.TEL = null ;


}

HH_FR_CUSTOMER_PIG.prototype.getTableName = function () {
    return "HH_FR_CUSTOMER_PIG";
}

HH_FR_CUSTOMER_PIG.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});

ret.push({key:'WAREHOUSE_CODE',remark:'Pk',val:'text'});

ret.push({key:'CUSTOMER_CODE',remark:'Pk',val:'text'});


	ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'CONTACT_PERSON',val:'text'});

ret.push({key:'CUSTOMER_GROUP',val:'text'});

ret.push({key:'TAX_ID',val:'text'});

ret.push({key:'AREA_CODE',val:'text'});

ret.push({key:'CUSTOMER_TYPE',val:'text'});

ret.push({key:'OPEN_ACCOUNT_DATE',val:'date'});

ret.push({key:'EMAIL',val:'text'});

ret.push({key:'CUSTOMER_NAME',val:'text'});

ret.push({key:'ADDRESS1',val:'text'});

ret.push({key:'ADDRESS2',val:'text'});

ret.push({key:'TEL',val:'text'});


	return ret;
}





HH_FR_MAS_CLOSE_PERIOD.prototype = new BaseBo();
function HH_FR_MAS_CLOSE_PERIOD(){
	this.CLOSE_TYPE = null ;

this.PERIOD = null ;

this.ORG_CODE = null ;

this.PROJECT_CODE = null ;

this.FARM_ORG = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.LAST_USER_ID = null ;

this.CANCEL_FLAG = null ;

this.OPERATION_CLOSE_FLAG = null ;

this.OPERATION_CLOSE_DATE = null ;

this.CANCEL_DATE = null ;

this.USER_CREATE = null ;

this.CREATE_DATE = null ;


}

HH_FR_MAS_CLOSE_PERIOD.prototype.getTableName = function () {
    return "HH_FR_MAS_CLOSE_PERIOD";
}

HH_FR_MAS_CLOSE_PERIOD.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'CLOSE_TYPE',remark:'Pk',val:'text'});

ret.push({key:'PERIOD',remark:'Pk',val:'date'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'PROJECT_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_USER_ID',val:'text'});

ret.push({key:'CANCEL_FLAG',val:'text'});

ret.push({key:'OPERATION_CLOSE_FLAG',val:'text'});

ret.push({key:'OPERATION_CLOSE_DATE',val:'date'});

ret.push({key:'CANCEL_DATE',val:'date'});

ret.push({key:'USER_CREATE',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});


	return ret;
}





HH_FR_MAS_FLOCK_INFORMATION.prototype = new BaseBo();
function HH_FR_MAS_FLOCK_INFORMATION(){
	this.ORG_CODE = null ;

this.FARM = null ;

this.HOUSE = null ;

this.FLOCK = null ;


	this.DATE_TRANSFER = null ;

this.HOLDING_DAY = null ;

this.LAYING_DAY = null ;

this.DATE_IN_5 = null ;

this.DATE_DOC_IN_5 = null ;

this.GROWING_DAY = null ;

this.DOCUMENT_IN_5 = null ;

this.BREEDER_CODE_4 = null ;

this.DATE_DOC_IN_4 = null ;

this.MOLTING_HOUSE = null ;

this.MOLTING_FLOCK = null ;

this.DATE_DOC_IN_1 = null ;

this.SIZE_1 = null ;

this.DATE_DOC_IN_2 = null ;

this.DOCUMENT_IN_8 = null ;

this.DATE_IN_8 = null ;

this.DATE_DOC_IN_8 = null ;

this.SIZE_8 = null ;

this.GRADE_CODE_F = null ;

this.PRODUCT_CODE_M = null ;

this.GRADE_CODE_M = null ;

this.CANCEL_FLAG = null ;

this.CANCEL_DATE = null ;

this.USER_CREATE = null ;

this.CREATE_DATE = null ;

this.OP_AVG_DATELAY = null ;

this.OP_AVG_DATECLOSE = null ;

this.DOCUMENT_IN_7 = null ;

this.DATE_IN_7 = null ;

this.DATE_DOC_IN_7 = null ;

this.SIZE_7 = null ;

this.BREEDER_CODE_7 = null ;

this.QUANTITY_IN_7 = null ;

this.MOLTING = null ;

this.BREEDER = null ;

this.DATE_DOC = null ;

this.DATE_IN = null ;

this.DATE_LAYING = null ;

this.DATE_HOLDING = null ;

this.DATE_CLOSE = null ;

this.START_DATE_MOLT = null ;

this.END_DATE_MOLT = null ;

this.CHICK_IN = null ;

this.CHICK_IN_F = null ;

this.CHICK_IN_M = null ;

this.CHICK_HH_F = null ;

this.CHICK_HH_M = null ;

this.PRODUCT_CODE_F = null ;

this.BREEDER_CODE_6 = null ;

this.DATE_IN_2 = null ;

this.LAST_USER_ID = null ;

this.DATE_HUNGRY = null ;

this.FL_DATECLOSE = null ;

this.OP_AVG_DATESTART = null ;

this.DOCUMENT_IN_4 = null ;

this.DATE_IN_4 = null ;

this.QUANTITY_IN_6 = null ;

this.DATE_IN_3 = null ;

this.DATE_DOC_IN_3 = null ;

this.SIZE_3 = null ;

this.BREEDER_CODE_3 = null ;

this.QUANTITY_IN_3 = null ;

this.LAST_UPDATE_DATE = null ;

this.ACTIVE_FLG = null ;

this.DATE_DOC_IN_10 = null ;

this.SIZE_10 = null ;

this.FUNCTION = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.BREEDER_CODE_8 = null ;

this.FLOCK_STATUS = null ;

this.SIZE_5 = null ;

this.SIZE_2 = null ;

this.BREEDER_CODE_2 = null ;

this.QUANTITY_IN_2 = null ;

this.DOCUMENT_IN_3 = null ;

this.QUANTITY_IN_8 = null ;

this.DOCUMENT_IN_9 = null ;

this.DATE_IN_9 = null ;

this.DATE_DOC_IN_9 = null ;

this.SIZE_9 = null ;

this.BREEDER_CODE_9 = null ;

this.QUANTITY_IN_9 = null ;

this.DOCUMENT_IN_10 = null ;

this.BREEDER_CODE_1 = null ;

this.QUANTITY_IN_1 = null ;

this.DOCUMENT_IN_2 = null ;

this.DATE_EGG = null ;

this.DATE_WEIGHT = null ;

this.WEIGHT_AVG = null ;

this.SEX = null ;

this.PRODUCTION_IN = null ;

this.PRODUCTION_OUT = null ;

this.HOLDING_CUM = null ;

this.BREEDER_CODE_5 = null ;

this.QUANTITY_IN_5 = null ;

this.DATE_IN_10 = null ;

this.HOLDING_OVER_DAY = null ;

this.DOCUMENT_IN_1 = null ;

this.DATE_IN_1 = null ;

this.BREEDER_CODE_10 = null ;

this.QUANTITY_IN_10 = null ;

this.FL_AVG_DATESTART = null ;

this.FL_AVG_DATELAY = null ;

this.DOCUMENT_IN_6 = null ;

this.DATE_IN_6 = null ;

this.DATE_DOC_IN_6 = null ;

this.SIZE_6 = null ;

this.SIZE_4 = null ;

this.QUANTITY_IN_4 = null ;


}

HH_FR_MAS_FLOCK_INFORMATION.prototype.getTableName = function () {
    return "HH_FR_MAS_FLOCK_INFORMATION";
}

HH_FR_MAS_FLOCK_INFORMATION.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM',remark:'Pk',val:'text'});

ret.push({key:'HOUSE',remark:'Pk',val:'text'});

ret.push({key:'FLOCK',remark:'Pk',val:'text'});


	ret.push({key:'DATE_TRANSFER',val:'date'});

ret.push({key:'HOLDING_DAY',val:'numeric'});

ret.push({key:'LAYING_DAY',val:'numeric'});

ret.push({key:'DATE_IN_5',val:'date'});

ret.push({key:'DATE_DOC_IN_5',val:'date'});

ret.push({key:'GROWING_DAY',val:'numeric'});

ret.push({key:'DOCUMENT_IN_5',val:'text'});

ret.push({key:'BREEDER_CODE_4',val:'text'});

ret.push({key:'DATE_DOC_IN_4',val:'date'});

ret.push({key:'MOLTING_HOUSE',val:'text'});

ret.push({key:'MOLTING_FLOCK',val:'text'});

ret.push({key:'DATE_DOC_IN_1',val:'date'});

ret.push({key:'SIZE_1',val:'text'});

ret.push({key:'DATE_DOC_IN_2',val:'date'});

ret.push({key:'DOCUMENT_IN_8',val:'text'});

ret.push({key:'DATE_IN_8',val:'date'});

ret.push({key:'DATE_DOC_IN_8',val:'date'});

ret.push({key:'SIZE_8',val:'text'});

ret.push({key:'GRADE_CODE_F',val:'text'});

ret.push({key:'PRODUCT_CODE_M',val:'text'});

ret.push({key:'GRADE_CODE_M',val:'text'});

ret.push({key:'CANCEL_FLAG',val:'text'});

ret.push({key:'CANCEL_DATE',val:'date'});

ret.push({key:'USER_CREATE',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'OP_AVG_DATELAY',val:'date'});

ret.push({key:'OP_AVG_DATECLOSE',val:'date'});

ret.push({key:'DOCUMENT_IN_7',val:'text'});

ret.push({key:'DATE_IN_7',val:'date'});

ret.push({key:'DATE_DOC_IN_7',val:'date'});

ret.push({key:'SIZE_7',val:'text'});

ret.push({key:'BREEDER_CODE_7',val:'text'});

ret.push({key:'QUANTITY_IN_7',val:'numeric'});

ret.push({key:'MOLTING',val:'numeric'});

ret.push({key:'BREEDER',val:'text'});

ret.push({key:'DATE_DOC',val:'date'});

ret.push({key:'DATE_IN',val:'date'});

ret.push({key:'DATE_LAYING',val:'date'});

ret.push({key:'DATE_HOLDING',val:'date'});

ret.push({key:'DATE_CLOSE',val:'date'});

ret.push({key:'START_DATE_MOLT',val:'date'});

ret.push({key:'END_DATE_MOLT',val:'date'});

ret.push({key:'CHICK_IN',val:'numeric'});

ret.push({key:'CHICK_IN_F',val:'numeric'});

ret.push({key:'CHICK_IN_M',val:'numeric'});

ret.push({key:'CHICK_HH_F',val:'numeric'});

ret.push({key:'CHICK_HH_M',val:'numeric'});

ret.push({key:'PRODUCT_CODE_F',val:'text'});

ret.push({key:'BREEDER_CODE_6',val:'text'});

ret.push({key:'DATE_IN_2',val:'date'});

ret.push({key:'LAST_USER_ID',val:'text'});

ret.push({key:'DATE_HUNGRY',val:'date'});

ret.push({key:'FL_DATECLOSE',val:'date'});

ret.push({key:'OP_AVG_DATESTART',val:'date'});

ret.push({key:'DOCUMENT_IN_4',val:'text'});

ret.push({key:'DATE_IN_4',val:'date'});

ret.push({key:'QUANTITY_IN_6',val:'numeric'});

ret.push({key:'DATE_IN_3',val:'date'});

ret.push({key:'DATE_DOC_IN_3',val:'date'});

ret.push({key:'SIZE_3',val:'text'});

ret.push({key:'BREEDER_CODE_3',val:'text'});

ret.push({key:'QUANTITY_IN_3',val:'numeric'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'ACTIVE_FLG',val:'text'});

ret.push({key:'DATE_DOC_IN_10',val:'date'});

ret.push({key:'SIZE_10',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'BREEDER_CODE_8',val:'text'});

ret.push({key:'FLOCK_STATUS',val:'text'});

ret.push({key:'SIZE_5',val:'text'});

ret.push({key:'SIZE_2',val:'text'});

ret.push({key:'BREEDER_CODE_2',val:'text'});

ret.push({key:'QUANTITY_IN_2',val:'numeric'});

ret.push({key:'DOCUMENT_IN_3',val:'text'});

ret.push({key:'QUANTITY_IN_8',val:'numeric'});

ret.push({key:'DOCUMENT_IN_9',val:'text'});

ret.push({key:'DATE_IN_9',val:'date'});

ret.push({key:'DATE_DOC_IN_9',val:'date'});

ret.push({key:'SIZE_9',val:'text'});

ret.push({key:'BREEDER_CODE_9',val:'text'});

ret.push({key:'QUANTITY_IN_9',val:'numeric'});

ret.push({key:'DOCUMENT_IN_10',val:'text'});

ret.push({key:'BREEDER_CODE_1',val:'text'});

ret.push({key:'QUANTITY_IN_1',val:'numeric'});

ret.push({key:'DOCUMENT_IN_2',val:'text'});

ret.push({key:'DATE_EGG',val:'date'});

ret.push({key:'DATE_WEIGHT',val:'date'});

ret.push({key:'WEIGHT_AVG',val:'numeric'});

ret.push({key:'SEX',val:'text'});

ret.push({key:'PRODUCTION_IN',val:'text'});

ret.push({key:'PRODUCTION_OUT',val:'text'});

ret.push({key:'HOLDING_CUM',val:'numeric'});

ret.push({key:'BREEDER_CODE_5',val:'text'});

ret.push({key:'QUANTITY_IN_5',val:'numeric'});

ret.push({key:'DATE_IN_10',val:'date'});

ret.push({key:'HOLDING_OVER_DAY',val:'numeric'});

ret.push({key:'DOCUMENT_IN_1',val:'text'});

ret.push({key:'DATE_IN_1',val:'date'});

ret.push({key:'BREEDER_CODE_10',val:'text'});

ret.push({key:'QUANTITY_IN_10',val:'numeric'});

ret.push({key:'FL_AVG_DATESTART',val:'date'});

ret.push({key:'FL_AVG_DATELAY',val:'date'});

ret.push({key:'DOCUMENT_IN_6',val:'text'});

ret.push({key:'DATE_IN_6',val:'date'});

ret.push({key:'DATE_DOC_IN_6',val:'date'});

ret.push({key:'SIZE_6',val:'text'});

ret.push({key:'SIZE_4',val:'text'});

ret.push({key:'QUANTITY_IN_4',val:'numeric'});


	return ret;
}





HH_FR_MAS_MAP_MOBILE.prototype = new BaseBo();
function HH_FR_MAS_MAP_MOBILE(){
	this.CUSTOMER_CODE = null ;

this.ORG_CODE = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_USER_ID = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.CANCEL_DATE = null ;

this.USER_MOBILE = null ;

this.USER_CREATE = null ;


}

HH_FR_MAS_MAP_MOBILE.prototype.getTableName = function () {
    return "HH_FR_MAS_MAP_MOBILE";
}

HH_FR_MAS_MAP_MOBILE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'CUSTOMER_CODE',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_USER_ID',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'CANCEL_DATE',val:'date'});

ret.push({key:'USER_MOBILE',val:'text'});

ret.push({key:'USER_CREATE',val:'text'});


	return ret;
}





HH_FR_MS_DAMAGE_TYPE.prototype = new BaseBo();
function HH_FR_MS_DAMAGE_TYPE(){
	this.CATEGORY = null ;

this.ORG_CODE = null ;

this.EGG_PRODUCT_CODE = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.DESC_LOC = null ;

this.DESC_ENG = null ;

this.DAMAGE_TYPE = null ;

this.OWNER = null ;


}

HH_FR_MS_DAMAGE_TYPE.prototype.getTableName = function () {
    return "HH_FR_MS_DAMAGE_TYPE";
}

HH_FR_MS_DAMAGE_TYPE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'CATEGORY',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'EGG_PRODUCT_CODE',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'numeric'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'DESC_LOC',val:'text'});

ret.push({key:'DESC_ENG',val:'text'});

ret.push({key:'DAMAGE_TYPE',val:'text'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_FR_MS_ENVIRONMENT.prototype = new BaseBo();
function HH_FR_MS_ENVIRONMENT(){
	this.ORG_CODE = null ;

this.FARM_ORG_LOC = null ;

this.TRANSACTION_DATE = null ;


	this.WATER_USE = null ;

this.PRESSURE_MAX = null ;

this.PRESSURE_MIN = null ;

this.LIGHT = null ;

this.OUTSIDE_TEMP_HIGH = null ;

this.HUMIDITY_MIN = null ;

this.HUMIDITY_MAX = null ;

this.OUTSIDE_TEMP_LOW = null ;

this.TEMP_MIN = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;

this.FUNCTION = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.TEMP_MAX = null ;


}

HH_FR_MS_ENVIRONMENT.prototype.getTableName = function () {
    return "HH_FR_MS_ENVIRONMENT";
}

HH_FR_MS_ENVIRONMENT.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});


	ret.push({key:'WATER_USE',val:'numeric'});

ret.push({key:'PRESSURE_MAX',val:'numeric'});

ret.push({key:'PRESSURE_MIN',val:'numeric'});

ret.push({key:'LIGHT',val:'numeric'});

ret.push({key:'OUTSIDE_TEMP_HIGH',val:'numeric'});

ret.push({key:'HUMIDITY_MIN',val:'numeric'});

ret.push({key:'HUMIDITY_MAX',val:'numeric'});

ret.push({key:'OUTSIDE_TEMP_LOW',val:'numeric'});

ret.push({key:'TEMP_MIN',val:'numeric'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'TEMP_MAX',val:'numeric'});


	return ret;
}





HH_FR_MS_FEED_PHASE.prototype = new BaseBo();
function HH_FR_MS_FEED_PHASE(){
	this.PRODUCT_CODE = null ;

this.ORG_CODE = null ;

this.PROJECT = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.LAST_USER_ID = null ;

this.CANCEL_FLAG = null ;

this.FEEDING_NO_PRODUCTION = null ;

this.FEEDING_NO = null ;

this.PACKING_SIZE = null ;

this.CANCEL_DATE = null ;

this.USER_CREATE = null ;

this.CREATE_DATE = null ;


}

HH_FR_MS_FEED_PHASE.prototype.getTableName = function () {
    return "HH_FR_MS_FEED_PHASE";
}

HH_FR_MS_FEED_PHASE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'PRODUCT_CODE',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'PROJECT',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_USER_ID',val:'text'});

ret.push({key:'CANCEL_FLAG',val:'text'});

ret.push({key:'FEEDING_NO_PRODUCTION',val:'text'});

ret.push({key:'FEEDING_NO',val:'text'});

ret.push({key:'PACKING_SIZE',val:'numeric'});

ret.push({key:'CANCEL_DATE',val:'date'});

ret.push({key:'USER_CREATE',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});


	return ret;
}





HH_FR_MS_GROWER_DEAD.prototype = new BaseBo();
function HH_FR_MS_GROWER_DEAD(){
	this.ORG_CODE = null ;

this.FARM_ORG = null ;

this.FARM_ORG_LOC = null ;

this.TRANSACTION_DATE = null ;

this.DOCUMENT_TYPE = null ;

this.DOCUMENT_EXT = null ;


	this.IMAGE2 = null ;

this.IMAGE1 = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.FEMALE_AMT = null ;

this.FEMALE_QTY = null ;

this.MALE_WGH = null ;

this.REASON_CODE = null ;

this.BIRTH_WEEK = null ;

this.BREEDER = null ;

this.DEAD_TYPE = null ;

this.MALE_QTY = null ;

this.MALE_AMT = null ;

this.FEMALE_WGH = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;


}

HH_FR_MS_GROWER_DEAD.prototype.getTableName = function () {
    return "HH_FR_MS_GROWER_DEAD";
}

HH_FR_MS_GROWER_DEAD.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});


	ret.push({key:'IMAGE2',val:'text'});

ret.push({key:'IMAGE1',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'FEMALE_AMT',val:'numeric'});

ret.push({key:'FEMALE_QTY',val:'numeric'});

ret.push({key:'MALE_WGH',val:'numeric'});

ret.push({key:'REASON_CODE',val:'text'});

ret.push({key:'BIRTH_WEEK',val:'text'});

ret.push({key:'BREEDER',val:'text'});

ret.push({key:'DEAD_TYPE',val:'text'});

ret.push({key:'MALE_QTY',val:'numeric'});

ret.push({key:'MALE_AMT',val:'numeric'});

ret.push({key:'FEMALE_WGH',val:'numeric'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});


	return ret;
}





HH_FR_MS_GROWER_MOVE.prototype = new BaseBo();
function HH_FR_MS_GROWER_MOVE(){
	this.ORG_CODE = null ;

this.FARM_ORG = null ;

this.FARM_ORG_LOC = null ;

this.TRANSACTION_DATE = null ;

this.DOCUMENT_TYPE = null ;

this.DOCUMENT_EXT = null ;


	this.GEN_SWINE_FLAG = null ;

this.TO_FARM_ORG = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.TO_SWINE_DATE_IN = null ;

this.TO_SWINE_ID = null ;

this.FEMALE_WGH = null ;

this.MALE_WGH = null ;

this.PRODUCTION_DATE = null ;

this.TO_FARM_ORG_LOC = null ;

this.BREEDER = null ;

this.BIRTH_WEEK = null ;

this.MALE_QTY = null ;

this.FEMALE_QTY = null ;

this.TO_BREEDER = null ;

this.TO_SWINE_TRACK = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;


}

HH_FR_MS_GROWER_MOVE.prototype.getTableName = function () {
    return "HH_FR_MS_GROWER_MOVE";
}

HH_FR_MS_GROWER_MOVE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});


	ret.push({key:'GEN_SWINE_FLAG',val:'text'});

ret.push({key:'TO_FARM_ORG',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'TO_SWINE_DATE_IN',val:'text'});

ret.push({key:'TO_SWINE_ID',val:'text'});

ret.push({key:'FEMALE_WGH',val:'numeric'});

ret.push({key:'MALE_WGH',val:'numeric'});

ret.push({key:'PRODUCTION_DATE',val:'date'});

ret.push({key:'TO_FARM_ORG_LOC',val:'text'});

ret.push({key:'BREEDER',val:'text'});

ret.push({key:'BIRTH_WEEK',val:'text'});

ret.push({key:'MALE_QTY',val:'numeric'});

ret.push({key:'FEMALE_QTY',val:'numeric'});

ret.push({key:'TO_BREEDER',val:'text'});

ret.push({key:'TO_SWINE_TRACK',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});


	return ret;
}





HH_FR_MS_GROWER_PURCHASE.prototype = new BaseBo();
function HH_FR_MS_GROWER_PURCHASE(){
	this.ORG_CODE = null ;

this.FARM_ORG = null ;

this.FARM_ORG_LOC = null ;

this.TRANSACTION_DATE = null ;

this.DOCUMENT_TYPE = null ;

this.DOCUMENT_EXT = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.FEMALE_QTY = null ;

this.MALE_WGH = null ;

this.PRODUCTION_DATE = null ;

this.BREEDER = null ;

this.PRODUCT_CODE = null ;

this.EXTRA_FEMALE_QTY = null ;

this.EXTRA_MALE_QTY = null ;

this.VENDOR_CODE = null ;

this.EXTRA_PER = null ;

this.REF_DOCUMENT_NO = null ;

this.BIRTH_WEEK = null ;

this.MALE_QTY = null ;

this.MALE_AMT = null ;

this.FEMALE_WGH = null ;

this.FEMALE_AMT = null ;

this.OWNER = null ;


}

HH_FR_MS_GROWER_PURCHASE.prototype.getTableName = function () {
    return "HH_FR_MS_GROWER_PURCHASE";
}

HH_FR_MS_GROWER_PURCHASE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'FEMALE_QTY',val:'numeric'});

ret.push({key:'MALE_WGH',val:'numeric'});

ret.push({key:'PRODUCTION_DATE',val:'date'});

ret.push({key:'BREEDER',val:'text'});

ret.push({key:'PRODUCT_CODE',val:'text'});

ret.push({key:'EXTRA_FEMALE_QTY',val:'numeric'});

ret.push({key:'EXTRA_MALE_QTY',val:'numeric'});

ret.push({key:'VENDOR_CODE',val:'text'});

ret.push({key:'EXTRA_PER',val:'numeric'});

ret.push({key:'REF_DOCUMENT_NO',val:'text'});

ret.push({key:'BIRTH_WEEK',val:'text'});

ret.push({key:'MALE_QTY',val:'numeric'});

ret.push({key:'MALE_AMT',val:'numeric'});

ret.push({key:'FEMALE_WGH',val:'numeric'});

ret.push({key:'FEMALE_AMT',val:'numeric'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_FR_MS_GROWER_SALE.prototype = new BaseBo();
function HH_FR_MS_GROWER_SALE(){
	this.FARM_ORG_LOC = null ;

this.TRANSACTION_DATE = null ;

this.DOCUMENT_TYPE = null ;

this.DOCUMENT_EXT = null ;

this.ORG_CODE = null ;

this.FARM_ORG = null ;


	this.SEX = null ;

this.OUTBOUND_TYPE = null ;

this.REASON_CODE = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.OWNER = null ;

this.FEMALE_WGH = null ;

this.MALE_AMT = null ;

this.MALE_QTY = null ;

this.GRADE = null ;

this.CUSTOMER_CODE = null ;

this.PRODUCT_CODE = null ;

this.REF_DOCUMENT_NO = null ;

this.BREEDER = null ;

this.BIRTH_WEEK = null ;

this.FLAG_CLOSE = null ;

this.TRUCK_NO = null ;

this.MALE_WGH = null ;

this.FEMALE_QTY = null ;

this.FEMALE_AMT = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;

this.FUNCTION = null ;


}

HH_FR_MS_GROWER_SALE.prototype.getTableName = function () {
    return "HH_FR_MS_GROWER_SALE";
}

HH_FR_MS_GROWER_SALE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});


	ret.push({key:'SEX',val:'text'});

ret.push({key:'OUTBOUND_TYPE',val:'text'});

ret.push({key:'REASON_CODE',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'FEMALE_WGH',val:'numeric'});

ret.push({key:'MALE_AMT',val:'numeric'});

ret.push({key:'MALE_QTY',val:'numeric'});

ret.push({key:'GRADE',val:'text'});

ret.push({key:'CUSTOMER_CODE',val:'text'});

ret.push({key:'PRODUCT_CODE',val:'text'});

ret.push({key:'REF_DOCUMENT_NO',val:'text'});

ret.push({key:'BREEDER',val:'text'});

ret.push({key:'BIRTH_WEEK',val:'text'});

ret.push({key:'FLAG_CLOSE',val:'text'});

ret.push({key:'TRUCK_NO',val:'text'});

ret.push({key:'MALE_WGH',val:'numeric'});

ret.push({key:'FEMALE_QTY',val:'numeric'});

ret.push({key:'FEMALE_AMT',val:'numeric'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});


	return ret;
}





HH_FR_MS_GROWER_STOCK.prototype = new BaseBo();
function HH_FR_MS_GROWER_STOCK(){
	this.DOCUMENT_EXT = null ;

this.TRANSACTION_TYPE = null ;

this.ORG_CODE = null ;

this.FARM_ORG = null ;

this.FARM_ORG_LOC = null ;

this.TRANSACTION_DATE = null ;

this.DOCUMENT_TYPE = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.FEMALE_QTY = null ;

this.MALE_WGH = null ;

this.BIRTH_WEEK = null ;

this.BREEDER = null ;

this.MALE_QTY = null ;

this.MALE_AMT = null ;

this.FEMALE_WGH = null ;

this.FEMALE_AMT = null ;

this.OWNER = null ;


}

HH_FR_MS_GROWER_STOCK.prototype.getTableName = function () {
    return "HH_FR_MS_GROWER_STOCK";
}

HH_FR_MS_GROWER_STOCK.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});

ret.push({key:'TRANSACTION_TYPE',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'FEMALE_QTY',val:'numeric'});

ret.push({key:'MALE_WGH',val:'numeric'});

ret.push({key:'BIRTH_WEEK',val:'text'});

ret.push({key:'BREEDER',val:'text'});

ret.push({key:'MALE_QTY',val:'numeric'});

ret.push({key:'MALE_AMT',val:'numeric'});

ret.push({key:'FEMALE_WGH',val:'numeric'});

ret.push({key:'FEMALE_AMT',val:'numeric'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_FR_MS_MATERIAL_ISSUED.prototype = new BaseBo();
function HH_FR_MS_MATERIAL_ISSUED(){
	this.DOCUMENT_TYPE = null ;

this.DOCUMENT_NO = null ;

this.DOCUMENT_EXT = null ;

this.PRODUCT_CODE = null ;

this.ORG_CODE = null ;

this.FARM_ORG = null ;

this.TRANSACTION_DATE = null ;


	this.USED = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.PO_DOCUMENT_NO = null ;

this.NET_AMT = null ;

this.WGH = null ;

this.EXPIRE_DATE = null ;

this.LOT_NUMBER = null ;

this.VENDOR_CODE = null ;

this.STOCK_TYPE = null ;

this.ENTRY_TYPE = null ;

this.REF_DOCUMENT_NO = null ;

this.PRODUCT_SPEC = null ;

this.EXTRA_PER = null ;

this.PRODUCTION_DATE = null ;

this.QTY = null ;

this.UNIT = null ;

this.PO_DOCUMENT_TYPE = null ;

this.PO_DOCUMENT_EXT = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;


}

HH_FR_MS_MATERIAL_ISSUED.prototype.getTableName = function () {
    return "HH_FR_MS_MATERIAL_ISSUED";
}

HH_FR_MS_MATERIAL_ISSUED.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_NO',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});

ret.push({key:'PRODUCT_CODE',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});


	ret.push({key:'USED',val:'numeric'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'PO_DOCUMENT_NO',val:'text'});

ret.push({key:'NET_AMT',val:'numeric'});

ret.push({key:'WGH',val:'numeric'});

ret.push({key:'EXPIRE_DATE',val:'date'});

ret.push({key:'LOT_NUMBER',val:'text'});

ret.push({key:'VENDOR_CODE',val:'text'});

ret.push({key:'STOCK_TYPE',val:'text'});

ret.push({key:'ENTRY_TYPE',val:'text'});

ret.push({key:'REF_DOCUMENT_NO',val:'text'});

ret.push({key:'PRODUCT_SPEC',val:'text'});

ret.push({key:'EXTRA_PER',val:'numeric'});

ret.push({key:'PRODUCTION_DATE',val:'date'});

ret.push({key:'QTY',val:'numeric'});

ret.push({key:'UNIT',val:'numeric'});

ret.push({key:'PO_DOCUMENT_TYPE',val:'text'});

ret.push({key:'PO_DOCUMENT_EXT',val:'numeric'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});


	return ret;
}





HH_FR_MS_MATERIAL_MOVE.prototype = new BaseBo();
function HH_FR_MS_MATERIAL_MOVE(){
	this.FARM_ORG = null ;

this.FARM_ORG_LOC = null ;

this.TRANSACTION_DATE = null ;

this.DOCUMENT_TYPE = null ;

this.DOCUMENT_EXT = null ;

this.ORG_CODE = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.VAL = null ;

this.QTY = null ;

this.EGG_AGE = null ;

this.EXPIRE_DATE = null ;

this.PRODUCT_CODE = null ;

this.TO_FARM_ORG_LOC = null ;

this.TRANSACTION_TYPE = null ;

this.TRANSACTION_CODE = null ;

this.REF_DOCUMENT_NO = null ;

this.LOT_NO = null ;

this.PRODUCTION_DATE = null ;

this.TRACKING_NO = null ;

this.WGH = null ;

this.COST = null ;

this.STOCK_TYPE = null ;

this.OWNER = null ;


}

HH_FR_MS_MATERIAL_MOVE.prototype.getTableName = function () {
    return "HH_FR_MS_MATERIAL_MOVE";
}

HH_FR_MS_MATERIAL_MOVE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'VAL',val:'numeric'});

ret.push({key:'QTY',val:'numeric'});

ret.push({key:'EGG_AGE',val:'numeric'});

ret.push({key:'EXPIRE_DATE',val:'date'});

ret.push({key:'PRODUCT_CODE',val:'text'});

ret.push({key:'TO_FARM_ORG_LOC',val:'text'});

ret.push({key:'TRANSACTION_TYPE',val:'text'});

ret.push({key:'TRANSACTION_CODE',val:'text'});

ret.push({key:'REF_DOCUMENT_NO',val:'text'});

ret.push({key:'LOT_NO',val:'text'});

ret.push({key:'PRODUCTION_DATE',val:'date'});

ret.push({key:'TRACKING_NO',val:'text'});

ret.push({key:'WGH',val:'numeric'});

ret.push({key:'COST',val:'numeric'});

ret.push({key:'STOCK_TYPE',val:'text'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_FR_MS_MATERIAL_PURCHASE.prototype = new BaseBo();
function HH_FR_MS_MATERIAL_PURCHASE(){
	this.DOCUMENT_EXT = null ;

this.TRANSACTION_DATE = null ;

this.ORG_CODE = null ;

this.FARM_ORG = null ;

this.DOCUMENT_TYPE = null ;


	this.NET_AMT = null ;

this.UNIT = null ;

this.WGH = null ;

this.QTY = null ;

this.PRODUCT_SPEC = null ;

this.REF_DOCUMENT_NO = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;

this.FUNCTION = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.STOCK_TYPE = null ;

this.ENTRY_TYPE = null ;

this.VENDOR_CODE = null ;

this.PRODUCT_CODE = null ;

this.LOT_NUMBER = null ;

this.PRODUCTION_DATE = null ;

this.EXPIRE_DATE = null ;


}

HH_FR_MS_MATERIAL_PURCHASE.prototype.getTableName = function () {
    return "HH_FR_MS_MATERIAL_PURCHASE";
}

HH_FR_MS_MATERIAL_PURCHASE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});


	ret.push({key:'NET_AMT',val:'numeric'});

ret.push({key:'UNIT',val:'numeric'});

ret.push({key:'WGH',val:'numeric'});

ret.push({key:'QTY',val:'numeric'});

ret.push({key:'PRODUCT_SPEC',val:'text'});

ret.push({key:'REF_DOCUMENT_NO',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'STOCK_TYPE',val:'text'});

ret.push({key:'ENTRY_TYPE',val:'text'});

ret.push({key:'VENDOR_CODE',val:'text'});

ret.push({key:'PRODUCT_CODE',val:'text'});

ret.push({key:'LOT_NUMBER',val:'text'});

ret.push({key:'PRODUCTION_DATE',val:'date'});

ret.push({key:'EXPIRE_DATE',val:'date'});


	return ret;
}





HH_FR_MS_MATERIAL_SALE.prototype = new BaseBo();
function HH_FR_MS_MATERIAL_SALE(){
	this.ORG_CODE = null ;

this.FARM_ORG = null ;

this.TRANSACTION_DATE = null ;

this.DOCUMENT_TYPE = null ;

this.DOCUMENT_EXT = null ;


	this.ENTRY_TYPE = null ;

this.STOCK_TYPE = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.NET_AMT = null ;

this.WGH = null ;

this.EXPIRE_DATE = null ;

this.LOT_NUMBER = null ;

this.PRODUCT_CODE = null ;

this.CUSTOMER_CODE = null ;

this.REF_DOCUMENT_NO = null ;

this.PRODUCT_SPEC = null ;

this.PRODUCTION_DATE = null ;

this.QTY = null ;

this.UNIT = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;


}

HH_FR_MS_MATERIAL_SALE.prototype.getTableName = function () {
    return "HH_FR_MS_MATERIAL_SALE";
}

HH_FR_MS_MATERIAL_SALE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});


	ret.push({key:'ENTRY_TYPE',val:'text'});

ret.push({key:'STOCK_TYPE',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'NET_AMT',val:'numeric'});

ret.push({key:'WGH',val:'numeric'});

ret.push({key:'EXPIRE_DATE',val:'date'});

ret.push({key:'LOT_NUMBER',val:'text'});

ret.push({key:'PRODUCT_CODE',val:'text'});

ret.push({key:'CUSTOMER_CODE',val:'text'});

ret.push({key:'REF_DOCUMENT_NO',val:'text'});

ret.push({key:'PRODUCT_SPEC',val:'text'});

ret.push({key:'PRODUCTION_DATE',val:'date'});

ret.push({key:'QTY',val:'numeric'});

ret.push({key:'UNIT',val:'numeric'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});


	return ret;
}





HH_FR_MS_MATERIAL_STOCK.prototype = new BaseBo();
function HH_FR_MS_MATERIAL_STOCK(){
	this.DOCUMENT_NO = null ;

this.TRANSACTION_DATE = null ;

this.ORG_CODE = null ;

this.FARM_ORG = null ;

this.FARM_ORG_LOC = null ;

this.PRODUCT_STOCK_TYPE = null ;

this.DOCUMENT_TYPE = null ;

this.DOCUMENT_EXT = null ;


	this.MALE_WGH = null ;

this.MALE_QTY = null ;

this.FEMALE_WGH = null ;

this.FEMALE_QTY = null ;

this.CREATE_DATE = null ;

this.WGH = null ;

this.PRODUCT_CODE = null ;

this.QTY = null ;

this.OWNER = null ;

this.LAST_UPDATE_DATE = null ;

this.FUNCTION = null ;

this.NUMBER_OF_SENDING_DATA = null ;


}

HH_FR_MS_MATERIAL_STOCK.prototype.getTableName = function () {
    return "HH_FR_MS_MATERIAL_STOCK";
}

HH_FR_MS_MATERIAL_STOCK.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'DOCUMENT_NO',remark:'Pk',val:'text'});

ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'PRODUCT_STOCK_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOCUMENT_EXT',remark:'Pk',val:'numeric'});


	ret.push({key:'MALE_WGH',val:'numeric'});

ret.push({key:'MALE_QTY',val:'numeric'});

ret.push({key:'FEMALE_WGH',val:'numeric'});

ret.push({key:'FEMALE_QTY',val:'numeric'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'WGH',val:'numeric'});

ret.push({key:'PRODUCT_CODE',val:'text'});

ret.push({key:'QTY',val:'numeric'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});


	return ret;
}





HH_FR_MS_PRODUCTION.prototype = new BaseBo();
function HH_FR_MS_PRODUCTION(){
	this.TRANSACTION_DATE = null ;

this.ORG_CODE = null ;

this.FARM_ORG_LOC = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.UNIFORM = null ;

this.LIVESTOCK_WGH_MALE = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.LIVESTOCK_WGH_FEMALE = null ;

this.EGG_WGH = null ;


}

HH_FR_MS_PRODUCTION.prototype.getTableName = function () {
    return "HH_FR_MS_PRODUCTION";
}

HH_FR_MS_PRODUCTION.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'UNIFORM',val:'numeric'});

ret.push({key:'LIVESTOCK_WGH_MALE',val:'numeric'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LIVESTOCK_WGH_FEMALE',val:'numeric'});

ret.push({key:'EGG_WGH',val:'numeric'});


	return ret;
}





HH_FR_MS_PRODUCTION_EGG.prototype = new BaseBo();
function HH_FR_MS_PRODUCTION_EGG(){
	this.TRANSACTION_DATE = null ;

this.FARM_ORG_LOC = null ;

this.ORG_CODE = null ;

this.EGG_PRODUCT_CODE = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.OWNER = null ;

this.EGG_QTY = null ;

this.CREATE_DATE = null ;


}

HH_FR_MS_PRODUCTION_EGG.prototype.getTableName = function () {
    return "HH_FR_MS_PRODUCTION_EGG";
}

HH_FR_MS_PRODUCTION_EGG.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'TRANSACTION_DATE',remark:'Pk',val:'date'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'EGG_PRODUCT_CODE',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'EGG_QTY',val:'numeric'});

ret.push({key:'CREATE_DATE',val:'date'});


	return ret;
}





HH_FR_STD_FEED.prototype = new BaseBo();
function HH_FR_STD_FEED(){
	this.AGE_DAY = null ;

this.PROJECT_CODE = null ;

this.ORG_CODE = null ;

this.LIVESTOCK_CODE = null ;

this.BREEDER_SEX = null ;


	this.LAST_UPDATE_DATE = null ;

this.FUNCTION = null ;

this.FEED_CODE = null ;

this.FEED_PER_HEAD = null ;

this.FEED_PHASE = null ;


}

HH_FR_STD_FEED.prototype.getTableName = function () {
    return "HH_FR_STD_FEED";
}

HH_FR_STD_FEED.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'AGE_DAY',remark:'Pk',val:'numeric'});

ret.push({key:'PROJECT_CODE',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'LIVESTOCK_CODE',remark:'Pk',val:'text'});

ret.push({key:'BREEDER_SEX',remark:'Pk',val:'text'});


	ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'FEED_CODE',val:'text'});

ret.push({key:'FEED_PER_HEAD',val:'numeric'});

ret.push({key:'FEED_PHASE',val:'text'});


	return ret;
}





HH_FR_STD_FEED_BY_FARM.prototype = new BaseBo();
function HH_FR_STD_FEED_BY_FARM(){
	this.LOT_NO = null ;

this.ORG_CODE = null ;

this.FARM_ORG_LOC = null ;

this.FEED_DATE = null ;

this.FEED_PHASE = null ;

this.FEED_CODE = null ;


	this.FEED_TOTAL = null ;

this.LAST_UPDATE_DATE = null ;

this.FUNCTION = null ;

this.FEED_PER_HEAD = null ;


}

HH_FR_STD_FEED_BY_FARM.prototype.getTableName = function () {
    return "HH_FR_STD_FEED_BY_FARM";
}

HH_FR_STD_FEED_BY_FARM.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'LOT_NO',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'FARM_ORG_LOC',remark:'Pk',val:'text'});

ret.push({key:'FEED_DATE',remark:'Pk',val:'date'});

ret.push({key:'FEED_PHASE',remark:'Pk',val:'text'});

ret.push({key:'FEED_CODE',remark:'Pk',val:'text'});


	ret.push({key:'FEED_TOTAL',val:'numeric'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'FEED_PER_HEAD',val:'numeric'});


	return ret;
}





HH_GD2_FR_MAS_TYPE_FARM.prototype = new BaseBo();
function HH_GD2_FR_MAS_TYPE_FARM(){
	this.GD_CODE = null ;

this.BUSINESS_UNIT = null ;

this.ORG_CODE = null ;

this.GD_TYPE = null ;


	this.FUNCTION = null ;

this.NUMBER_OF_SENDING_DATA = null ;

this.LAST_USER_ID = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.COMMENT1 = null ;

this.CANCEL_FLAG = null ;

this.CONDITION_09 = null ;

this.CONDITION_07 = null ;

this.DESC_LOC = null ;

this.DESC_ENG = null ;

this.CONDITION_01 = null ;

this.CONDITION_02 = null ;

this.CONDITION_03 = null ;

this.CONDITION_04 = null ;

this.CONDITION_05 = null ;

this.CONDITION_06 = null ;

this.CONDITION_08 = null ;

this.CONDITION_10 = null ;

this.CANCEL_DATE = null ;

this.USER_CREATE = null ;


}

HH_GD2_FR_MAS_TYPE_FARM.prototype.getTableName = function () {
    return "HH_GD2_FR_MAS_TYPE_FARM";
}

HH_GD2_FR_MAS_TYPE_FARM.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'GD_CODE',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'ORG_CODE',remark:'Pk',val:'text'});

ret.push({key:'GD_TYPE',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'LAST_USER_ID',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'COMMENT1',val:'text'});

ret.push({key:'CANCEL_FLAG',val:'text'});

ret.push({key:'CONDITION_09',val:'text'});

ret.push({key:'CONDITION_07',val:'text'});

ret.push({key:'DESC_LOC',val:'text'});

ret.push({key:'DESC_ENG',val:'text'});

ret.push({key:'CONDITION_01',val:'text'});

ret.push({key:'CONDITION_02',val:'text'});

ret.push({key:'CONDITION_03',val:'text'});

ret.push({key:'CONDITION_04',val:'text'});

ret.push({key:'CONDITION_05',val:'text'});

ret.push({key:'CONDITION_06',val:'text'});

ret.push({key:'CONDITION_08',val:'text'});

ret.push({key:'CONDITION_10',val:'text'});

ret.push({key:'CANCEL_DATE',val:'date'});

ret.push({key:'USER_CREATE',val:'text'});


	return ret;
}





HH_INIT.prototype = new BaseBo();
function HH_INIT(){
	this.KEY = null ;

this.PROGRAM_ID = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.OWNER = null ;

this.CAN_EDIT = null ;

this.INPUT_TYPES = null ;

this.DESCRIPTION = null ;

this.DOMAIN_VALUES = null ;

this.VALUE = null ;

this.FOR_ADMIN = null ;


}

HH_INIT.prototype.getTableName = function () {
    return "HH_INIT";
}

HH_INIT.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'KEY',remark:'Pk',val:'text'});

ret.push({key:'PROGRAM_ID',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CAN_EDIT',val:'text'});

ret.push({key:'INPUT_TYPES',val:'text'});

ret.push({key:'DESCRIPTION',val:'text'});

ret.push({key:'DOMAIN_VALUES',val:'text'});

ret.push({key:'VALUE',val:'text'});

ret.push({key:'FOR_ADMIN',val:'text'});


	return ret;
}





HH_JOB_OPER.prototype = new BaseBo();
function HH_JOB_OPER(){
	this.JOB_NO = null ;

this.OPERATION = null ;

this.BUSINESS_UNIT = null ;

this.COMPANY = null ;

this.SUB_OPERATION = null ;


	this.FUNCTION = null ;

this.STATUS = null ;

this.LAST_OWNER = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;

this.OWNER = null ;

this.JOB_NAME = null ;


}

HH_JOB_OPER.prototype.getTableName = function () {
    return "HH_JOB_OPER";
}

HH_JOB_OPER.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'JOB_NO',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'JOB_NAME',val:'text'});


	return ret;
}





HH_LABOR_OPER.prototype = new BaseBo();
function HH_LABOR_OPER(){
	this.LABOR_CODE = null ;

this.OPERATION = null ;

this.BUSINESS_UNIT = null ;

this.COMPANY = null ;

this.SUB_OPER = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.LAST_OWNER = null ;

this.CREATE_DATE = null ;

this.DESCRIPTION = null ;

this.STATUS = null ;

this.OWNER = null ;


}

HH_LABOR_OPER.prototype.getTableName = function () {
    return "HH_LABOR_OPER";
}

HH_LABOR_OPER.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'LABOR_CODE',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPER',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'DESCRIPTION',val:'text'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_LOT_OPER.prototype = new BaseBo();
function HH_LOT_OPER(){
	this.LOT = null ;

this.OPERATION = null ;

this.BUSINESS_UNIT = null ;

this.COMPANY = null ;

this.SUB_OPERATION = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.OWNER = null ;

this.LAST_OWNER = null ;

this.STATUS = null ;

this.DESCRIPTION = null ;


}

HH_LOT_OPER.prototype.getTableName = function () {
    return "HH_LOT_OPER";
}

HH_LOT_OPER.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'LOT',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'DESCRIPTION',val:'text'});


	return ret;
}





HH_OPERATION_BU.prototype = new BaseBo();
function HH_OPERATION_BU(){
	this.BUSINESS_UNIT = null ;

this.OPERATION_CODE = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.OWNER = null ;

this.ADDRESS2 = null ;

this.OPERATION_NAME = null ;

this.ADDRESS1 = null ;

this.TEL = null ;

this.TAX_ID = null ;

this.COMPANY_CODE = null ;


}

HH_OPERATION_BU.prototype.getTableName = function () {
    return "HH_OPERATION_BU";
}

HH_OPERATION_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'OPERATION_CODE',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'ADDRESS2',val:'text'});

ret.push({key:'OPERATION_NAME',val:'text'});

ret.push({key:'ADDRESS1',val:'text'});

ret.push({key:'TEL',val:'text'});

ret.push({key:'TAX_ID',val:'text'});

ret.push({key:'COMPANY_CODE',val:'text'});


	return ret;
}





HH_PRODUCT_BU.prototype = new BaseBo();
function HH_PRODUCT_BU(){
	this.PRODUCT_CODE = null ;

this.BUSINESS_UNIT = null ;


	this.STOCK_KEEPING_UNIT = null ;

this.UNIT_PACK = null ;

this.PRODUCT_STOCK_TYPE = null ;

this.PRODUCT_GROUP = null ;

this.FUNCTION = null ;

this.CREATE_DATE = null ;

this.QUANTITY_REQUIRE = null ;

this.STANDARD_WEIGHT = null ;

this.UM_CODE_ORDER = null ;

this.PRODUCT_NAME = null ;

this.PRODUCT_SHORT_NAME = null ;

this.PMA_CODE = null ;

this.TAX_TYPE = null ;

this.TAX_CODE = null ;

this.TAX_FLAG = null ;

this.PACKAGING_SIZE = null ;

this.PRODUCT_INTRODUCE_DATE = null ;

this.UM_CODE_PRICE = null ;

this.WEIGHT_REQUIRE = null ;

this.OWNER = null ;

this.LAST_UPDATE_DATE = null ;

this.CATEGORY = null ;

this.SUB_CATEGORY = null ;

this.PRODUCT_LINE = null ;


}

HH_PRODUCT_BU.prototype.getTableName = function () {
    return "HH_PRODUCT_BU";
}

HH_PRODUCT_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'PRODUCT_CODE',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});


	ret.push({key:'STOCK_KEEPING_UNIT',val:'text'});

ret.push({key:'UNIT_PACK',val:'numeric'});

ret.push({key:'PRODUCT_STOCK_TYPE',val:'text'});

ret.push({key:'PRODUCT_GROUP',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'QUANTITY_REQUIRE',val:'numeric'});

ret.push({key:'STANDARD_WEIGHT',val:'numeric'});

ret.push({key:'UM_CODE_ORDER',val:'text'});

ret.push({key:'PRODUCT_NAME',val:'text'});

ret.push({key:'PRODUCT_SHORT_NAME',val:'text'});

ret.push({key:'PMA_CODE',val:'text'});

ret.push({key:'TAX_TYPE',val:'text'});

ret.push({key:'TAX_CODE',val:'text'});

ret.push({key:'TAX_FLAG',val:'text'});

ret.push({key:'PACKAGING_SIZE',val:'text'});

ret.push({key:'PRODUCT_INTRODUCE_DATE',val:'date'});

ret.push({key:'UM_CODE_PRICE',val:'text'});

ret.push({key:'WEIGHT_REQUIRE',val:'numeric'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CATEGORY',val:'text'});

ret.push({key:'SUB_CATEGORY',val:'text'});

ret.push({key:'PRODUCT_LINE',val:'text'});


	return ret;
}





HH_PRODUCT_PRICE_BU.prototype = new BaseBo();
function HH_PRODUCT_PRICE_BU(){
	this.CHOICE_NO = null ;

this.EFFECTIVE_DATE = null ;

this.BUSINESS_UNIT = null ;

this.PRODUCT_CODE = null ;

this.CLASS_PRICE = null ;

this.UM_CODE = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.STATUS_DATE = null ;

this.NET_PRICE = null ;

this.STATUS = null ;

this.OWNER = null ;


}

HH_PRODUCT_PRICE_BU.prototype.getTableName = function () {
    return "HH_PRODUCT_PRICE_BU";
}

HH_PRODUCT_PRICE_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'CHOICE_NO',remark:'Pk',val:'numeric'});

ret.push({key:'EFFECTIVE_DATE',remark:'Pk',val:'date'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'PRODUCT_CODE',remark:'Pk',val:'text'});

ret.push({key:'CLASS_PRICE',remark:'Pk',val:'text'});

ret.push({key:'UM_CODE',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'STATUS_DATE',val:'date'});

ret.push({key:'NET_PRICE',val:'numeric'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_SERVER_SEND_BU.prototype = new BaseBo();
function HH_SERVER_SEND_BU(){
	this.USER_ID = null ;

this.DEVICE_ID = null ;

this.BUSINESS_UNIT = null ;

this.PROGRAM_ID = null ;

this.TABLE_NAME = null ;


	this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.NO_ROW_SEND = null ;

this.NO_ROW_CLIENT_RECEIVE = null ;

this.TOTAL_ROW_COUNT = null ;

this.LAST_PK_DATA = null ;

this.LAST_DATA_TIMESTAMP = null ;


}

HH_SERVER_SEND_BU.prototype.getTableName = function () {
    return "HH_SERVER_SEND_BU";
}

HH_SERVER_SEND_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'USER_ID',remark:'Pk',val:'text'});

ret.push({key:'DEVICE_ID',remark:'Pk',val:'numeric'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'PROGRAM_ID',remark:'Pk',val:'text'});

ret.push({key:'TABLE_NAME',remark:'Pk',val:'text'});


	ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'NO_ROW_SEND',val:'numeric'});

ret.push({key:'NO_ROW_CLIENT_RECEIVE',val:'numeric'});

ret.push({key:'TOTAL_ROW_COUNT',val:'numeric'});

ret.push({key:'LAST_PK_DATA',val:'text'});

ret.push({key:'LAST_DATA_TIMESTAMP',val:'date'});


	return ret;
}





HH_SHIFT_OPER.prototype = new BaseBo();
function HH_SHIFT_OPER(){
	this.SUB_OPERATION = null ;

this.COMPANY = null ;

this.BUSINESS_UNIT = null ;

this.OPERATION = null ;

this.SHIFT_NO = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.LAST_OWNER = null ;

this.CREATE_DATE = null ;

this.STATUS = null ;

this.OWNER = null ;


}

HH_SHIFT_OPER.prototype.getTableName = function () {
    return "HH_SHIFT_OPER";
}

HH_SHIFT_OPER.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});

ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});

ret.push({key:'SHIFT_NO',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_SUB_LOT_OPER.prototype = new BaseBo();
function HH_SUB_LOT_OPER(){
	this.SUB_OPERATION = null ;

this.COMPANY = null ;

this.BUSINESS_UNIT = null ;

this.OPERATION = null ;

this.SUBLOT = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.LAST_OWNER = null ;

this.STATUS = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.DESCRIPTION = null ;


}

HH_SUB_LOT_OPER.prototype.getTableName = function () {
    return "HH_SUB_LOT_OPER";
}

HH_SUB_LOT_OPER.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});

ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});

ret.push({key:'SUBLOT',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'DESCRIPTION',val:'text'});


	return ret;
}





HH_SUB_WAREHOUSE_OPER.prototype = new BaseBo();
function HH_SUB_WAREHOUSE_OPER(){
	this.SUB_WAREHOUSE_CODE = null ;

this.SUB_OPERATION = null ;

this.COMPANY = null ;

this.BUSINESS_UNIT = null ;

this.OPERATION = null ;

this.WAREHOUSE_CODE = null ;


	this.FUNCTION = null ;

this.STATUS = null ;

this.LAST_UPDATE_DATE = null ;

this.LAST_OWNER = null ;

this.SUB_WAREHOUSE_NAME = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;


}

HH_SUB_WAREHOUSE_OPER.prototype.getTableName = function () {
    return "HH_SUB_WAREHOUSE_OPER";
}

HH_SUB_WAREHOUSE_OPER.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'SUB_WAREHOUSE_CODE',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});

ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});

ret.push({key:'WAREHOUSE_CODE',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'SUB_WAREHOUSE_NAME',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});


	return ret;
}





HH_SYNC_CONFIG_BU.prototype = new BaseBo();
function HH_SYNC_CONFIG_BU(){
	this.BUSINESS_UNIT = null ;

this.PROGRAM_ID = null ;

this.TABLE_NAME = null ;


	this.EXT3 = null ;

this.EXT2 = null ;

this.EXT1 = null ;

this.UPLOAD_CONNECTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.CLIENT_UPLOAD_STATEMENT = null ;

this.IS_UPLOAD = null ;

this.IS_CREATE_TABLE = null ;

this.IS_DOWNLOAD = null ;

this.DOWNLOAD_STATEMENT = null ;

this.CLIENT_DATA_PURGING = null ;

this.CREATE_USER = null ;

this.OWNER = null ;

this.FUNCTION = null ;

this.DOWNLOAD_CONNECTION = null ;


}

HH_SYNC_CONFIG_BU.prototype.getTableName = function () {
    return "HH_SYNC_CONFIG_BU";
}

HH_SYNC_CONFIG_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'PROGRAM_ID',remark:'Pk',val:'text'});

ret.push({key:'TABLE_NAME',remark:'Pk',val:'text'});


	ret.push({key:'EXT3',val:'text'});

ret.push({key:'EXT2',val:'text'});

ret.push({key:'EXT1',val:'text'});

ret.push({key:'UPLOAD_CONNECTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'CLIENT_UPLOAD_STATEMENT',val:'text'});

ret.push({key:'IS_UPLOAD',val:'text'});

ret.push({key:'IS_CREATE_TABLE',val:'text'});

ret.push({key:'IS_DOWNLOAD',val:'text'});

ret.push({key:'DOWNLOAD_STATEMENT',val:'text'});

ret.push({key:'CLIENT_DATA_PURGING',val:'text'});

ret.push({key:'CREATE_USER',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'DOWNLOAD_CONNECTION',val:'text'});


	return ret;
}





HH_UI_LANG.prototype = new BaseBo();
function HH_UI_LANG(){
	this.ATTR_ID = null ;

this.OBJECT_ID = null ;

this.FORM_ID = null ;

this.PROGRAM_ID = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.TEXT_ORIGINAL = null ;

this.OWNER = null ;

this.TEXT_ENG = null ;

this.TEXT_LOCAL = null ;

this.LAST_UPDATE_DATE = null ;


}

HH_UI_LANG.prototype.getTableName = function () {
    return "HH_UI_LANG";
}

HH_UI_LANG.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ATTR_ID',remark:'Pk',val:'text'});

ret.push({key:'OBJECT_ID',remark:'Pk',val:'text'});

ret.push({key:'FORM_ID',remark:'Pk',val:'text'});

ret.push({key:'PROGRAM_ID',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'TEXT_ORIGINAL',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'TEXT_ENG',val:'text'});

ret.push({key:'TEXT_LOCAL',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});


	return ret;
}





HH_UI_LANG_EXPORT.prototype = new BaseBo();
function HH_UI_LANG_EXPORT(){
	this.PROGRAM_ID = null ;

this.FORM_ID = null ;

this.OBJECT_ID = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.LAST_UPDATE_DATE = null ;

this.OWNER = null ;

this.TEXT_ORIGINAL = null ;


}

HH_UI_LANG_EXPORT.prototype.getTableName = function () {
    return "HH_UI_LANG_EXPORT";
}

HH_UI_LANG_EXPORT.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'PROGRAM_ID',remark:'Pk',val:'text'});

ret.push({key:'FORM_ID',remark:'Pk',val:'text'});

ret.push({key:'OBJECT_ID',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'TEXT_ORIGINAL',val:'text'});


	return ret;
}





HH_UPLOAD_COMPLETE_LOG.prototype = new BaseBo();
function HH_UPLOAD_COMPLETE_LOG(){
	this.ID = null ;


	this.FLAG4 = null ;

this.FAIL_TABLE = null ;

this.FLAG3 = null ;

this.FLAG2 = null ;

this.LAST_UPDATE_DATE = null ;

this.SUCCESS_TABLE = null ;

this.USER_ID = null ;

this.BUSINESS_UNIT = null ;

this.SUB_OPERATION = null ;

this.PROGRAM_ID = null ;

this.DEVICE_ID = null ;

this.CREATE_DATE = null ;

this.FUNCTION = null ;

this.OWNER = null ;

this.FLAG1 = null ;


}

HH_UPLOAD_COMPLETE_LOG.prototype.getTableName = function () {
    return "HH_UPLOAD_COMPLETE_LOG";
}

HH_UPLOAD_COMPLETE_LOG.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'ID',remark:'Pk',val:'numeric'});


	ret.push({key:'FLAG4',val:'text'});

ret.push({key:'FAIL_TABLE',val:'text'});

ret.push({key:'FLAG3',val:'text'});

ret.push({key:'FLAG2',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'SUCCESS_TABLE',val:'text'});

ret.push({key:'USER_ID',val:'text'});

ret.push({key:'BUSINESS_UNIT',val:'text'});

ret.push({key:'SUB_OPERATION',val:'text'});

ret.push({key:'PROGRAM_ID',val:'text'});

ret.push({key:'DEVICE_ID',val:'numeric'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'FLAG1',val:'text'});


	return ret;
}





HH_USER_BU.prototype = new BaseBo();
function HH_USER_BU(){
	this.USER_ID = null ;

this.BUSINESS_UNIT = null ;


	this.EXT3 = null ;

this.EXT2 = null ;

this.EXT1 = null ;

this.SUB_WAREHOUSE_NAME = null ;

this.BUSINESS_TYPE = null ;

this.WAREHOUSE = null ;

this.SUB_OPERATION = null ;

this.SEX_TYPE = null ;

this.FUNCTION = null ;

this.USER_PASSWORD = null ;

this.AUTHORIZE_CODE = null ;

this.USER_TYPE = null ;

this.FIRST_NAME = null ;

this.LAST_NAME = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.LAST_UPDATE_DATE = null ;

this.USER_CODE = null ;

this.OPERATION_CODE = null ;

this.USER_ID_SIGNATURE = null ;

this.SUB_WAREHOUSE = null ;

this.OPERATION_NAME = null ;

this.SUB_OPERATION_NAME = null ;

this.WAREHOUSE_NAME = null ;


}

HH_USER_BU.prototype.getTableName = function () {
    return "HH_USER_BU";
}

HH_USER_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'USER_ID',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});


	ret.push({key:'EXT3',val:'text'});

ret.push({key:'EXT2',val:'text'});

ret.push({key:'EXT1',val:'text'});

ret.push({key:'SUB_WAREHOUSE_NAME',val:'text'});

ret.push({key:'BUSINESS_TYPE',val:'text'});

ret.push({key:'WAREHOUSE',val:'text'});

ret.push({key:'SUB_OPERATION',val:'text'});

ret.push({key:'SEX_TYPE',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'USER_PASSWORD',val:'text'});

ret.push({key:'AUTHORIZE_CODE',val:'text'});

ret.push({key:'USER_TYPE',val:'text'});

ret.push({key:'FIRST_NAME',val:'text'});

ret.push({key:'LAST_NAME',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'USER_CODE',val:'text'});

ret.push({key:'OPERATION_CODE',val:'text'});

ret.push({key:'USER_ID_SIGNATURE',val:'text'});

ret.push({key:'SUB_WAREHOUSE',val:'text'});

ret.push({key:'OPERATION_NAME',val:'text'});

ret.push({key:'SUB_OPERATION_NAME',val:'text'});

ret.push({key:'WAREHOUSE_NAME',val:'text'});


	return ret;
}





HH_USER_MENU_BU.prototype = new BaseBo();
function HH_USER_MENU_BU(){
	this.BUSINESS_UNIT = null ;

this.PROGRAM = null ;

this.MENU_ID = null ;


	this.DESCR_ENG = null ;

this.BACKGROUND_COLOR = null ;

this.FLG_ADJ_COLOR = null ;

this.PICTURE = null ;

this.OWNER = null ;

this.PAGE_LEVEL_TYPE = null ;

this.OPEN_PATH = null ;

this.DESCR = null ;

this.PARENT_ID = null ;

this.ORDER_IDX = null ;

this.PROGRAM_ID = null ;

this.PARAMETERS = null ;

this.PROGRAM_TYPE = null ;

this.CREATED_DATE = null ;

this.LAST_UPDATE_DATE = null ;

this.FUNCTION = null ;


}

HH_USER_MENU_BU.prototype.getTableName = function () {
    return "HH_USER_MENU_BU";
}

HH_USER_MENU_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'PROGRAM',remark:'Pk',val:'text'});

ret.push({key:'MENU_ID',remark:'Pk',val:'numeric'});


	ret.push({key:'DESCR_ENG',val:'text'});

ret.push({key:'BACKGROUND_COLOR',val:'text'});

ret.push({key:'FLG_ADJ_COLOR',val:'text'});

ret.push({key:'PICTURE',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'PAGE_LEVEL_TYPE',val:'text'});

ret.push({key:'OPEN_PATH',val:'text'});

ret.push({key:'DESCR',val:'text'});

ret.push({key:'PARENT_ID',val:'numeric'});

ret.push({key:'ORDER_IDX',val:'numeric'});

ret.push({key:'PROGRAM_ID',val:'text'});

ret.push({key:'PARAMETERS',val:'text'});

ret.push({key:'PROGRAM_TYPE',val:'text'});

ret.push({key:'CREATED_DATE',val:'date'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});


	return ret;
}





HH_USER_OPERATION_BU.prototype = new BaseBo();
function HH_USER_OPERATION_BU(){
	this.BUSINESS_UNIT = null ;

this.USER_ID = null ;

this.EXT_NUMBER = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.BUSINESS_TYPE = null ;

this.SUB_WAREHOUSE = null ;

this.WAREHOUSE = null ;

this.SUB_OPERATION = null ;

this.OPERATION_CODE = null ;

this.COMPANY_CODE = null ;

this.OPERATION_NAME = null ;

this.SUB_OPERATION_NAME = null ;

this.WAREHOUSE_NAME = null ;

this.SUB_WAREHOUSE_NAME = null ;

this.START_DATE = null ;

this.END_DATE = null ;

this.OWNER = null ;


}

HH_USER_OPERATION_BU.prototype.getTableName = function () {
    return "HH_USER_OPERATION_BU";
}

HH_USER_OPERATION_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'USER_ID',remark:'Pk',val:'text'});

ret.push({key:'EXT_NUMBER',remark:'Pk',val:'numeric'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'BUSINESS_TYPE',val:'text'});

ret.push({key:'SUB_WAREHOUSE',val:'text'});

ret.push({key:'WAREHOUSE',val:'text'});

ret.push({key:'SUB_OPERATION',val:'text'});

ret.push({key:'OPERATION_CODE',val:'text'});

ret.push({key:'COMPANY_CODE',val:'text'});

ret.push({key:'OPERATION_NAME',val:'text'});

ret.push({key:'SUB_OPERATION_NAME',val:'text'});

ret.push({key:'WAREHOUSE_NAME',val:'text'});

ret.push({key:'SUB_WAREHOUSE_NAME',val:'text'});

ret.push({key:'START_DATE',val:'date'});

ret.push({key:'END_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});


	return ret;
}





HH_USER_PREFERENCE_BU.prototype = new BaseBo();
function HH_USER_PREFERENCE_BU(){
	this.PROGRAM_ID = null ;

this.BUSINESS_UNIT = null ;

this.USER_ID = null ;

this.KEY = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.FUNCTION = null ;

this.OWNER = null ;

this.LAST_UPDATE_DATE = null ;

this.DATA_TYPE = null ;

this.ENG_DESC = null ;

this.EXT2 = null ;

this.EXT1 = null ;

this.EXT3 = null ;

this.LOCAL_DESC = null ;

this.VAL = null ;

this.CREATE_DATE = null ;


}

HH_USER_PREFERENCE_BU.prototype.getTableName = function () {
    return "HH_USER_PREFERENCE_BU";
}

HH_USER_PREFERENCE_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'PROGRAM_ID',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'USER_ID',remark:'Pk',val:'text'});

ret.push({key:'KEY',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'DATA_TYPE',val:'text'});

ret.push({key:'ENG_DESC',val:'text'});

ret.push({key:'EXT2',val:'text'});

ret.push({key:'EXT1',val:'text'});

ret.push({key:'EXT3',val:'text'});

ret.push({key:'LOCAL_DESC',val:'text'});

ret.push({key:'VAL',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});


	return ret;
}





HH_USER_PROGRAM_BU.prototype = new BaseBo();
function HH_USER_PROGRAM_BU(){
	this.PROGRAM = null ;

this.BUSINESS_UNIT = null ;

this.USER_ID = null ;

this.PROGRAM_ID = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.OWNER = null ;

this.USE_FLAG = null ;


}

HH_USER_PROGRAM_BU.prototype.getTableName = function () {
    return "HH_USER_PROGRAM_BU";
}

HH_USER_PROGRAM_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'PROGRAM',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'USER_ID',remark:'Pk',val:'text'});

ret.push({key:'PROGRAM_ID',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'USE_FLAG',val:'text'});


	return ret;
}





HH_VENDOR.prototype = new BaseBo();
function HH_VENDOR(){
	this.VENDOR_CODE = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.CONTACT_PERSON = null ;

this.VENDOR_TYPE = null ;

this.VENDOR_GROUP = null ;

this.OPEN_ACCOUNT_DATE = null ;

this.OWNER = null ;

this.AREA_CODE = null ;

this.VENDOR_NAME = null ;

this.ADDRESS1 = null ;

this.ADDRESS2 = null ;

this.TEL = null ;

this.EMAIL = null ;

this.TAX_ID = null ;


}

HH_VENDOR.prototype.getTableName = function () {
    return "HH_VENDOR";
}

HH_VENDOR.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'VENDOR_CODE',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'CONTACT_PERSON',val:'text'});

ret.push({key:'VENDOR_TYPE',val:'text'});

ret.push({key:'VENDOR_GROUP',val:'text'});

ret.push({key:'OPEN_ACCOUNT_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'AREA_CODE',val:'text'});

ret.push({key:'VENDOR_NAME',val:'text'});

ret.push({key:'ADDRESS1',val:'text'});

ret.push({key:'ADDRESS2',val:'text'});

ret.push({key:'TEL',val:'text'});

ret.push({key:'EMAIL',val:'text'});

ret.push({key:'TAX_ID',val:'text'});


	return ret;
}





HH_VENDOR_WH_BU.prototype = new BaseBo();
function HH_VENDOR_WH_BU(){
	this.EXT_NUMBER = null ;

this.VENDOR_CODE = null ;

this.BUSINESS_UNIT = null ;

this.SUB_OPERATION = null ;


	this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.OWNER = null ;

this.CLASS_PRICE = null ;

this.CREATE_DATE = null ;

this.SUB_WAREHOUSE = null ;

this.WAREHOUSE_CODE = null ;


}

HH_VENDOR_WH_BU.prototype.getTableName = function () {
    return "HH_VENDOR_WH_BU";
}

HH_VENDOR_WH_BU.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'EXT_NUMBER',remark:'Pk',val:'numeric'});

ret.push({key:'VENDOR_CODE',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CLASS_PRICE',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'SUB_WAREHOUSE',val:'text'});

ret.push({key:'WAREHOUSE_CODE',val:'text'});


	return ret;
}





HH_WAREHOUSE_OPER.prototype = new BaseBo();
function HH_WAREHOUSE_OPER(){
	this.WAREHOUSE_CODE = null ;

this.OPERATION = null ;

this.BUSINESS_UNIT = null ;

this.COMPANY = null ;

this.SUB_OPERATION = null ;


	this.FUNCTION = null ;

this.STATUS = null ;

this.LAST_UPDATE_DATE = null ;

this.LAST_OWNER = null ;

this.WAREHOUSE_NAME = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;


}

HH_WAREHOUSE_OPER.prototype.getTableName = function () {
    return "HH_WAREHOUSE_OPER";
}

HH_WAREHOUSE_OPER.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'WAREHOUSE_CODE',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});


	ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'WAREHOUSE_NAME',val:'text'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});


	return ret;
}





S1_ST_STOCK_BALANCE.prototype = new BaseBo();
function S1_ST_STOCK_BALANCE(){
	this.SERIAL_NO = null ;

this.SUB_LOT_NUMBER = null ;

this.LOT_NUMBER = null ;

this.PRODUCT_SPEC = null ;

this.BUSINESS_UNIT = null ;

this.OPERATION = null ;

this.PRODUCTION_DATE = null ;

this.EXPIRE_DATE = null ;

this.RECEIVED_DATE = null ;

this.COMPANY = null ;

this.SUB_OPERATION = null ;

this.WAREHOUSE_CODE = null ;

this.SUB_WAREHOUSE_CODE = null ;

this.PRODUCT_CODE = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.LAST_UPDATE_DATE = null ;

this.QUANTITY = null ;

this.WEIGHT = null ;

this.FUNCTION = null ;


}

S1_ST_STOCK_BALANCE.prototype.getTableName = function () {
    return "S1_ST_STOCK_BALANCE";
}

S1_ST_STOCK_BALANCE.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'SERIAL_NO',remark:'Pk',val:'text'});

ret.push({key:'SUB_LOT_NUMBER',remark:'Pk',val:'text'});

ret.push({key:'LOT_NUMBER',remark:'Pk',val:'text'});

ret.push({key:'PRODUCT_SPEC',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});

ret.push({key:'PRODUCTION_DATE',remark:'Pk',val:'text'});

ret.push({key:'EXPIRE_DATE',remark:'Pk',val:'text'});

ret.push({key:'RECEIVED_DATE',remark:'Pk',val:'text'});

ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});

ret.push({key:'WAREHOUSE_CODE',remark:'Pk',val:'text'});

ret.push({key:'SUB_WAREHOUSE_CODE',remark:'Pk',val:'text'});

ret.push({key:'PRODUCT_CODE',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'QUANTITY',val:'numeric'});

ret.push({key:'WEIGHT',val:'numeric'});

ret.push({key:'FUNCTION',val:'text'});


	return ret;
}





S1_ST_STOCK_TRN.prototype = new BaseBo();
function S1_ST_STOCK_TRN(){
	this.COMPANY = null ;

this.OPERATION = null ;

this.SUB_OPERATION = null ;

this.BUSINESS_UNIT = null ;

this.DOC_TYPE = null ;

this.DOC_NUMBER = null ;

this.EXT_NUMBER = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.SUB_WAREHOUSE_CODE = null ;

this.WAREHOUSE_CODE = null ;

this.RECEIVED_DATE = null ;

this.SHIFT_NO = null ;

this.OLD_RETAIL_PRICE = null ;

this.PRODUCT_KEYIN = null ;

this.DEPARTMENT = null ;

this.LAST_UPDATE_DATE = null ;

this.DATA_SOURCE = null ;

this.INT_GL_FLAG = null ;

this.INT_ST_FLAG = null ;

this.INT_STAT_FLAG = null ;

this.STATUS = null ;

this.STATUS_DATE = null ;

this.OWNER = null ;

this.CREATE_DATE = null ;

this.LAST_OWNER = null ;

this.COST_METHOD = null ;

this.UNIT_COST = null ;

this.COST = null ;

this.STD_SALES_UNIT_PRICE = null ;

this.STD_COST_UNIT_PRICE = null ;

this.PRINT_STATUS = null ;

this.LAST_PRINT_DATE = null ;

this.PRINT_OWNER = null ;

this.PRINT_NO = null ;

this.DC_SHIP_FLAG = null ;

this.PRODUCT_STOCK_TYPE = null ;

this.PRODUCT_CODE = null ;

this.PRODUCT_SPEC = null ;

this.LOT_NUMBER = null ;

this.SUB_LOT_NUMBER = null ;

this.SERIAL_NO = null ;

this.PRODUCTION_DATE = null ;

this.EXPIRE_DATE = null ;

this.PRODUCED_ITEM = null ;

this.LAB_STATUS = null ;

this.LAB_STATUS_DATE = null ;

this.LAS_UNSTATUS_DATE = null ;

this.MACHINE_NO = null ;

this.APPROVAL_OWNER = null ;

this.APPROVAL_DATE = null ;

this.RIDER_CODE = null ;

this.TRANSPORT_STATUS = null ;

this.TAX_TYPE = null ;

this.TAX_CODE = null ;

this.TAX_RATE = null ;

this.MEDICINE_CODE = null ;

this.STOCK_KEEPING_UNIT = null ;

this.QUANTITY = null ;

this.UM_QTY = null ;

this.FREE_QTY = null ;

this.FEMALE_QTY = null ;

this.MALE_QTY = null ;

this.WEIGHT = null ;

this.UM_WEIGHT = null ;

this.FREE_WGH = null ;

this.CURRENCY_CODE = null ;

this.UNIT_PRICE = null ;

this.AMOUNT = null ;

this.CAL_TYPE = null ;

this.LABOR_CODE = null ;

this.UNIT_LEVEL = null ;

this.CV_CODE = null ;

this.REASON_CODE = null ;

this.REMARK1 = null ;

this.ENTRY_TYPE = null ;

this.PRODUCTION_NO = null ;

this.FORMULA_CODE = null ;

this.DOCUMENT_DATE = null ;

this.DOC_GROUP = null ;

this.DOC_SUB_GROUP = null ;

this.DOC_ISSU_UNIT = null ;

this.DOC_CTRL_UNIT = null ;

this.REF_COMPANY = null ;

this.REF_OPERATION_CODE = null ;

this.REF_SUB_OPERATION = null ;

this.REF_DOC_DATE = null ;

this.REF_DOC_TYPE = null ;

this.REF_DOC_ISSU = null ;

this.REF_DOC_CTRL = null ;

this.REF_DOC_NO = null ;

this.REF_EXT_NUMBER = null ;

this.REF_INPUT_DOC_NO = null ;

this.REF_TRN_CODE = null ;

this.TRN_TYPE = null ;

this.TRN_CODE = null ;

this.FUNCTION = null ;

this.PMA_CODE = null ;

this.CLASS_RETAIL = null ;

this.NEW_RETAIL_PRICE = null ;

this.PRICE_CHANGE_QTY = null ;

this.RETAIL_IN_VAT = null ;

this.RETAIL_EX_VAT = null ;


}

S1_ST_STOCK_TRN.prototype.getTableName = function () {
    return "S1_ST_STOCK_TRN";
}

S1_ST_STOCK_TRN.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'OPERATION',remark:'Pk',val:'text'});

ret.push({key:'SUB_OPERATION',remark:'Pk',val:'text'});

ret.push({key:'BUSINESS_UNIT',remark:'Pk',val:'text'});

ret.push({key:'DOC_TYPE',remark:'Pk',val:'text'});

ret.push({key:'DOC_NUMBER',remark:'Pk',val:'text'});

ret.push({key:'EXT_NUMBER',remark:'Pk',val:'numeric'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'SUB_WAREHOUSE_CODE',val:'text'});

ret.push({key:'WAREHOUSE_CODE',val:'text'});

ret.push({key:'RECEIVED_DATE',val:'text'});

ret.push({key:'SHIFT_NO',val:'text'});

ret.push({key:'OLD_RETAIL_PRICE',val:'numeric'});

ret.push({key:'PRODUCT_KEYIN',val:'text'});

ret.push({key:'DEPARTMENT',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'DATA_SOURCE',val:'text'});

ret.push({key:'INT_GL_FLAG',val:'text'});

ret.push({key:'INT_ST_FLAG',val:'text'});

ret.push({key:'INT_STAT_FLAG',val:'text'});

ret.push({key:'STATUS',val:'text'});

ret.push({key:'STATUS_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'LAST_OWNER',val:'text'});

ret.push({key:'COST_METHOD',val:'text'});

ret.push({key:'UNIT_COST',val:'numeric'});

ret.push({key:'COST',val:'numeric'});

ret.push({key:'STD_SALES_UNIT_PRICE',val:'numeric'});

ret.push({key:'STD_COST_UNIT_PRICE',val:'numeric'});

ret.push({key:'PRINT_STATUS',val:'text'});

ret.push({key:'LAST_PRINT_DATE',val:'date'});

ret.push({key:'PRINT_OWNER',val:'text'});

ret.push({key:'PRINT_NO',val:'numeric'});

ret.push({key:'DC_SHIP_FLAG',val:'text'});

ret.push({key:'PRODUCT_STOCK_TYPE',val:'text'});

ret.push({key:'PRODUCT_CODE',val:'text'});

ret.push({key:'PRODUCT_SPEC',val:'text'});

ret.push({key:'LOT_NUMBER',val:'text'});

ret.push({key:'SUB_LOT_NUMBER',val:'text'});

ret.push({key:'SERIAL_NO',val:'text'});

ret.push({key:'PRODUCTION_DATE',val:'date'});

ret.push({key:'EXPIRE_DATE',val:'date'});

ret.push({key:'PRODUCED_ITEM',val:'text'});

ret.push({key:'LAB_STATUS',val:'text'});

ret.push({key:'LAB_STATUS_DATE',val:'date'});

ret.push({key:'LAS_UNSTATUS_DATE',val:'date'});

ret.push({key:'MACHINE_NO',val:'text'});

ret.push({key:'APPROVAL_OWNER',val:'text'});

ret.push({key:'APPROVAL_DATE',val:'date'});

ret.push({key:'RIDER_CODE',val:'text'});

ret.push({key:'TRANSPORT_STATUS',val:'text'});

ret.push({key:'TAX_TYPE',val:'text'});

ret.push({key:'TAX_CODE',val:'text'});

ret.push({key:'TAX_RATE',val:'numeric'});

ret.push({key:'MEDICINE_CODE',val:'text'});

ret.push({key:'STOCK_KEEPING_UNIT',val:'text'});

ret.push({key:'QUANTITY',val:'numeric'});

ret.push({key:'UM_QTY',val:'text'});

ret.push({key:'FREE_QTY',val:'numeric'});

ret.push({key:'FEMALE_QTY',val:'numeric'});

ret.push({key:'MALE_QTY',val:'numeric'});

ret.push({key:'WEIGHT',val:'numeric'});

ret.push({key:'UM_WEIGHT',val:'text'});

ret.push({key:'FREE_WGH',val:'numeric'});

ret.push({key:'CURRENCY_CODE',val:'text'});

ret.push({key:'UNIT_PRICE',val:'numeric'});

ret.push({key:'AMOUNT',val:'numeric'});

ret.push({key:'CAL_TYPE',val:'numeric'});

ret.push({key:'LABOR_CODE',val:'text'});

ret.push({key:'UNIT_LEVEL',val:'text'});

ret.push({key:'CV_CODE',val:'text'});

ret.push({key:'REASON_CODE',val:'text'});

ret.push({key:'REMARK1',val:'text'});

ret.push({key:'ENTRY_TYPE',val:'text'});

ret.push({key:'PRODUCTION_NO',val:'text'});

ret.push({key:'FORMULA_CODE',val:'text'});

ret.push({key:'DOCUMENT_DATE',val:'date'});

ret.push({key:'DOC_GROUP',val:'text'});

ret.push({key:'DOC_SUB_GROUP',val:'text'});

ret.push({key:'DOC_ISSU_UNIT',val:'text'});

ret.push({key:'DOC_CTRL_UNIT',val:'text'});

ret.push({key:'REF_COMPANY',val:'text'});

ret.push({key:'REF_OPERATION_CODE',val:'text'});

ret.push({key:'REF_SUB_OPERATION',val:'text'});

ret.push({key:'REF_DOC_DATE',val:'date'});

ret.push({key:'REF_DOC_TYPE',val:'text'});

ret.push({key:'REF_DOC_ISSU',val:'text'});

ret.push({key:'REF_DOC_CTRL',val:'text'});

ret.push({key:'REF_DOC_NO',val:'text'});

ret.push({key:'REF_EXT_NUMBER',val:'numeric'});

ret.push({key:'REF_INPUT_DOC_NO',val:'text'});

ret.push({key:'REF_TRN_CODE',val:'text'});

ret.push({key:'TRN_TYPE',val:'text'});

ret.push({key:'TRN_CODE',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'PMA_CODE',val:'text'});

ret.push({key:'CLASS_RETAIL',val:'text'});

ret.push({key:'NEW_RETAIL_PRICE',val:'numeric'});

ret.push({key:'PRICE_CHANGE_QTY',val:'numeric'});

ret.push({key:'RETAIL_IN_VAT',val:'numeric'});

ret.push({key:'RETAIL_EX_VAT',val:'numeric'});


	return ret;
}





TRN_CONTROL.prototype = new BaseBo();
function TRN_CONTROL(){
	this.COMPANY = null ;

this.DOC_TYPE = null ;

this.TRN_CODE = null ;


	this.CONF_DETAIL = null ;

this.CONF_HEADER = null ;

this.CONF_REF_DOC = null ;

this.INTERFACE_LOCATION = null ;

this.LAST_UPDATE_DATE = null ;

this.OWNER = null ;

this.WITHHOLDING_FLAG = null ;

this.TRN_FLAG = null ;

this.AMT_FLAG = null ;

this.STATISTIC_TYPE = null ;

this.STATISTIC_FLAG = null ;

this.STOCK_ACC_TYPE = null ;

this.GL_FLAG = null ;

this.FORMULA_REQUIRE = null ;

this.REASON_REQUIRE = null ;

this.JOB_REQUIRE = null ;

this.DEST_FLAG = null ;

this.AUTO_GEN_RECEIVE = null ;

this.MAINTAIN_FLAG = null ;

this.STOCK_TYPE = null ;

this.STOCK_FLAG = null ;

this.COST_METHOD = null ;

this.OWNER_TRN_CODE = null ;

this.WITHHOLDING_CODE = null ;

this.CREATE_DATE = null ;

this.FUNCTION = null ;

this.UL_REQUIRE = null ;

this.ENTRY_GROUP = null ;


}

TRN_CONTROL.prototype.getTableName = function () {
    return "TRN_CONTROL";
}

TRN_CONTROL.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'COMPANY',remark:'Pk',val:'text'});

ret.push({key:'DOC_TYPE',remark:'Pk',val:'text'});

ret.push({key:'TRN_CODE',remark:'Pk',val:'text'});


	ret.push({key:'CONF_DETAIL',val:'text'});

ret.push({key:'CONF_HEADER',val:'text'});

ret.push({key:'CONF_REF_DOC',val:'text'});

ret.push({key:'INTERFACE_LOCATION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'WITHHOLDING_FLAG',val:'text'});

ret.push({key:'TRN_FLAG',val:'text'});

ret.push({key:'AMT_FLAG',val:'text'});

ret.push({key:'STATISTIC_TYPE',val:'text'});

ret.push({key:'STATISTIC_FLAG',val:'text'});

ret.push({key:'STOCK_ACC_TYPE',val:'text'});

ret.push({key:'GL_FLAG',val:'text'});

ret.push({key:'FORMULA_REQUIRE',val:'text'});

ret.push({key:'REASON_REQUIRE',val:'text'});

ret.push({key:'JOB_REQUIRE',val:'text'});

ret.push({key:'DEST_FLAG',val:'text'});

ret.push({key:'AUTO_GEN_RECEIVE',val:'text'});

ret.push({key:'MAINTAIN_FLAG',val:'text'});

ret.push({key:'STOCK_TYPE',val:'text'});

ret.push({key:'STOCK_FLAG',val:'text'});

ret.push({key:'COST_METHOD',val:'text'});

ret.push({key:'OWNER_TRN_CODE',val:'text'});

ret.push({key:'WITHHOLDING_CODE',val:'text'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'UL_REQUIRE',val:'text'});

ret.push({key:'ENTRY_GROUP',val:'text'});


	return ret;
}





TRN_DESC.prototype = new BaseBo();
function TRN_DESC(){
	this.TRN_CODE = null ;

this.DOC_TYPE = null ;


	this.NUMBER_OF_SENDING_DATA = null ;

this.WITHHOLDING_CODE = null ;

this.WITHHOLDING_FLAG = null ;

this.FUNCTION = null ;

this.LAST_UPDATE_DATE = null ;

this.CREATE_DATE = null ;

this.OWNER = null ;

this.GROUP_OF_TRN = null ;

this.TRN_SORT_SEQ = null ;

this.DOC_SUB_GROUP = null ;

this.DOC_GROUP = null ;

this.SORT_NAME = null ;

this.ABBR_NAME = null ;

this.SHORT_NAME_ENG = null ;

this.SHORT_NAME_LOCAL = null ;

this.NAME_ENG = null ;

this.NAME_LOCAL = null ;


}

TRN_DESC.prototype.getTableName = function () {
    return "TRN_DESC";
}

TRN_DESC.prototype.getFields = function(){
	var ret = new Array;	
	ret.push({key:'TRN_CODE',remark:'Pk',val:'text'});

ret.push({key:'DOC_TYPE',remark:'Pk',val:'text'});


	ret.push({key:'NUMBER_OF_SENDING_DATA',val:'numeric'});

ret.push({key:'WITHHOLDING_CODE',val:'text'});

ret.push({key:'WITHHOLDING_FLAG',val:'text'});

ret.push({key:'FUNCTION',val:'text'});

ret.push({key:'LAST_UPDATE_DATE',val:'date'});

ret.push({key:'CREATE_DATE',val:'date'});

ret.push({key:'OWNER',val:'text'});

ret.push({key:'GROUP_OF_TRN',val:'text'});

ret.push({key:'TRN_SORT_SEQ',val:'text'});

ret.push({key:'DOC_SUB_GROUP',val:'text'});

ret.push({key:'DOC_GROUP',val:'text'});

ret.push({key:'SORT_NAME',val:'text'});

ret.push({key:'ABBR_NAME',val:'text'});

ret.push({key:'SHORT_NAME_ENG',val:'text'});

ret.push({key:'SHORT_NAME_LOCAL',val:'text'});

ret.push({key:'NAME_ENG',val:'text'});

ret.push({key:'NAME_LOCAL',val:'text'});


	return ret;
}





