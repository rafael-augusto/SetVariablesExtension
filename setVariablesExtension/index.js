"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const variables = tl.getInput("variables", true);
            let splitted = variables.split('\n').map(val => {
                if (!val)
                    return;
                let trimmed = val.trim();
                let dictionaryValue = undefined;
                if (trimmed.indexOf('=') > 0)
                    dictionaryValue = trimmed.split('=');
                else {
                    let variableValue = tl.getVariable(trimmed);
                    if (!variableValue) {
                        console.log(`##[warning] variable ${trimmed} value not found on current environment. Value will be replaced to '.'`);
                        dictionaryValue = [trimmed, '.'];
                    }
                    else
                        dictionaryValue = [trimmed, variableValue];
                }
                return dictionaryValue;
            });
            splitted = splitted.filter(item => item != null && item != undefined);
            console.table(splitted);
            let varCount = splitted.length;
            console.log(`Encountered ${varCount} variables`);
            let varSetCounter = 0;
            splitted.forEach(x => {
                let variable = x[0];
                let value = x[1];
                console.log(`Set ${variable} to ${value}`);
                console.log(`##vso[task.setvariable variable=${variable};]${value}`);
                varSetCounter++;
            });
            tl.setResult(tl.TaskResult.Succeeded, `Sucessfully set ${varSetCounter} variables`);
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
