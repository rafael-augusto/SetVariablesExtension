import tl = require('azure-pipelines-task-lib/task');

async function run() {
    try {
		
		const variables: string | undefined = tl.getInput("variables", true);
		
		let splitted : Array<string[]> = variables.split('\n').map(val => {
			if(!val)
				return;
			
			let trimmed :string = val.trim();
			
			let dictionaryValue : string[] = undefined;
			
			if(trimmed.indexOf('=') > 0)
				dictionaryValue = trimmed.split('=');
			else{
				let variableValue =tl.getVariable(trimmed);
				if(!variableValue)
				{
					console.log(`##[warning] variable ${trimmed} value not found on current environment. Value will be replaced to '.'`);
					dictionaryValue =[trimmed, '.']
				}
				else
					dictionaryValue = [trimmed, variableValue];
			}

			return dictionaryValue;
		});
		
		splitted = splitted.filter(item  => item != null && item != undefined);
		
		console.table(splitted);
		let varCount : number = splitted.length;
		console.log(`Encountered ${varCount} variables`);
		
		let varSetCounter : number = 0;
		splitted.forEach(x =>{
			let variable :string = x[0];
			let value:string = x[1];
			console.log(`Set ${variable} to ${value}`);
			console.log(`##vso[task.setvariable variable=${variable};]${value}`);
			varSetCounter ++;
		});
		
		tl.setResult(tl.TaskResult.Succeeded, `Sucessfully set ${varSetCounter} variables`);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
