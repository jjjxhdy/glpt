let cityPage = {
    '崖州区': 0,
    '天涯区': 1,
    '吉阳区': 2,
    '海棠区': 3,
    '秀英区': 0,
    '龙华区': 1,
    '琼山区': 1,
    '美兰区': 2,
}
function getCost(worker, order) {
    if((worker.power - order.level) < 0) {
        return 999999;
    }
    let cost = (worker.power - order.level) +
        Math.min(Math.abs(cityPage[worker.area] - cityPage[order.area]), 2)
    return cost;
}
function hungarianS(costMatrix) {
    // 定义一个内部函数，用于在给定成本矩阵中找到当前最优分配
    function bestAssignment(costMatrix) {
        const nWorkers = costMatrix.length;
        const nProblems = costMatrix[0].length;
         // 初始化最优分配数组，初始值为-1表示未分配
        const assignment = new Array(nProblems).fill(-1);
        // 遍历所有工人，为其找到对应成本最小的任务进行分配
        for (let worker = 0; worker < nWorkers; worker++) {
            let minCost = Infinity;
            let bestProblem = -1;
            // 寻找当前工人成本最小的任务
            for (let problem = 0; problem < nProblems; problem++) {
                if (costMatrix[worker][problem] < minCost) {
                    minCost = costMatrix[worker][problem];
                    bestProblem = problem;
                }
            }
            // 将找到的成本最小的任务分配给当前工人
            assignment[bestProblem] = worker;
        }
        // 返回当前最优分配结果
        return assignment;
    }
    // 初始化工人列表和分配结果
    let workerList = Array.from({ length: costMatrix.length }, (_, i) => i);
    let assignment = bestAssignment(costMatrix);
    // 初始化结果映射和未分配问题列表
    let resultMap = {};
    let legacy = []
    // 遍历初步分配结果，记录已分配情况并处理未分配问题
    for (let problem = 0; problem < assignment.length; problem++) {
        const worker = assignment[problem];
        // 如果任务已分配，则记录分配结果并从工人列表中移除该工人
        if (worker !== -1) {
            resultMap[worker] = problem;
            workerList = workerList.filter(item => item !== worker);
        } else {
            // 将未分配任务加入列表
            legacy.push(problem)
        }
    }
    // 对未分配问题进行二次分配，依次找到剩余工人中成本最低的进行分配
    for(let i = 0 ;i<legacy.length;i++){
        let cb = []// 存储工人-任务成本
        let gr = [] // 存储工人索引
        // 遍历剩余工人，计算其与当前未分配任务的成本并存储相关信息
        for(let j = 0 ;j<workerList.length;j++){
            cb.push(costMatrix[workerList[j]][legacy[i]])
            gr.push(workerList[j])
        }
        // 找到成本最低的工人
        let ll = gr[cb.indexOf(Math.min(...cb))]
        // 将该工人分配给当前未分配任务
        resultMap[ll] = legacy[i]
        // 从剩余工人列表中移除已分配的工人
        workerList = workerList.filter(item => item !== ll);
    }
    // 返回最终的工人-任务最优分配结果
    return resultMap;
}

function hungarian(costMatrix) {
    function bestAssignment(costMatrix) {
        // 定义一个内部函数，实现匈牙利算法的完整步骤
        const nWorkers = costMatrix.length;
        const nProblems = costMatrix[0].length;

        // Step 1: Subtract the minimum cost from each row
        for (let i = 0; i < nWorkers; i++) {
            let minCost = Math.min(...costMatrix[i]);
            for (let j = 0; j < nProblems; j++) {
                costMatrix[i][j] -= minCost;
            }
        }

        // Step 2: Subtract the minimum cost from each column
        for (let j = 0; j < nProblems; j++) {
            let minCost = Math.min(...costMatrix.map(row => row[j]));
            for (let i = 0; i < nWorkers; i++) {
                costMatrix[i][j] -= minCost;
            }
        }
        // 初始化分配结果和行/列覆盖状态
        let assignment = {};
        let rowsCovered = new Array(nWorkers).fill(false);
        let colsCovered = new Array(nProblems).fill(false);
         // 主循环，寻找零元素并进行分配直至无更多零元素可分配
        while (true) {
            let zeros = [];
            // 寻找未覆盖行和列中的零元素
            for (let i = 0; i < nWorkers; i++) {
                for (let j = 0; j < nProblems; j++) {
                    if (costMatrix[i][j] === 0 && !rowsCovered[i] && !colsCovered[j]) {
                        zeros.push({ row: i, col: j });
                    }
                }
            }
             // 若无更多零元素可分配，跳出循环
            if (zeros.length === 0) {
                break;
            }
            // 选择一个零元素进行分配，并标记对应的行和列为已覆盖
            let zero = zeros[0];
            assignment[zero.row] = zero.col;
            rowsCovered[zero.row] = true;
            colsCovered[zero.col] = true;
        }
        // 返回最终的工人-任务最优分配结果
        return assignment;
    }
}


module.exports = {
    hungarian,
    hungarianS,
    getCost
}
