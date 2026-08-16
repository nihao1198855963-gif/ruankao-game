// 过程组闯关数据（十大领域 × 五大过程组）
window.PROCESS_GROUPS = [{"key": "启动", "mnemonic": "先立项"}, {"key": "规划", "mnemonic": "先计划"}, {"key": "执行", "mnemonic": "开始干"}, {"key": "监控", "mnemonic": "边干边查"}, {"key": "收尾", "mnemonic": "最后验收"}];
window.PROCESS_AREAS = [
 {
  "key": "integration",
  "name": "整合管理",
  "memory": "整合 = 从头管到尾：先立项（章程）→ 定计划 → 带着团队干、边干边攒经验 → 盯着进度改变更 → 收工归档。7 个过程串成一条线，就不会记乱。",
  "cards": [
   {
    "id": "int-1",
    "name": "制定项目章程",
    "keywords": "章程 · 批准 · 授权",
    "group": "启动"
   },
   {
    "id": "int-2",
    "name": "制订项目管理计划",
    "keywords": "计划 · 整合 · 怎么做",
    "group": "规划"
   },
   {
    "id": "int-3",
    "name": "指导与管理项目工作",
    "keywords": "指导 · 干活 · 执行",
    "group": "执行"
   },
   {
    "id": "int-4",
    "name": "管理项目知识",
    "keywords": "知识 · 经验教训",
    "group": "执行"
   },
   {
    "id": "int-5",
    "name": "监控项目工作",
    "keywords": "监控 · 跟踪 · 绩效",
    "group": "监控"
   },
   {
    "id": "int-6",
    "name": "实施整体变更控制",
    "keywords": "变更 · 审批 · CCB",
    "group": "监控"
   },
   {
    "id": "int-7",
    "name": "结束项目或阶段",
    "keywords": "结束 · 收尾 · 归档",
    "group": "收尾"
   }
  ],
  "poolOrder": [
   "int-3",
   "int-7",
   "int-1",
   "int-5",
   "int-2",
   "int-6",
   "int-4"
  ]
 },
 {
  "key": "scope",
  "name": "范围管理",
  "memory": "范围 = 先划清边界，再守住不乱加：规划怎么管 → 收集需求 → 定义范围 → 拆成 WBS（这 4 步都在「规划」）；成果交客户验收（确认范围）、随时防范围蔓延（控制范围）（这 2 步在「监控」）。",
  "cards": [
   {
    "id": "scope-1",
    "name": "规划范围管理",
    "keywords": "规划 · 范围计划 · 怎么管",
    "group": "规划"
   },
   {
    "id": "scope-2",
    "name": "收集需求",
    "keywords": "收集 · 需求 · 访谈问卷",
    "group": "规划"
   },
   {
    "id": "scope-3",
    "name": "定义范围",
    "keywords": "定义 · 范围说明书",
    "group": "规划"
   },
   {
    "id": "scope-4",
    "name": "创建 WBS",
    "keywords": "分解 · 工作包 · WBS",
    "group": "规划"
   },
   {
    "id": "scope-5",
    "name": "确认范围",
    "keywords": "验收 · 客户确认 · 成果",
    "group": "监控"
   },
   {
    "id": "scope-6",
    "name": "控制范围",
    "keywords": "控制 · 范围变更 · 防蔓延",
    "group": "监控"
   }
  ],
  "poolOrder": [
   "scope-5",
   "scope-2",
   "scope-4",
   "scope-1",
   "scope-6",
   "scope-3"
  ]
 },
 {
  "key": "schedule",
  "name": "进度管理",
  "memory": "进度 = 先把计划一步步做出来，再盯着走：定方针 → 拆出活动 → 排先后 → 估工期 → 排出计划（这 5 步都在「规划」）；然后控制进度（在「监控」）。",
  "cards": [
   {
    "id": "schedule-1",
    "name": "规划进度管理",
    "keywords": "规划 · 进度方针 · 怎么排期",
    "group": "规划"
   },
   {
    "id": "schedule-2",
    "name": "定义活动",
    "keywords": "定义 · 活动清单 · 拆工作包",
    "group": "规划"
   },
   {
    "id": "schedule-3",
    "name": "排列活动顺序",
    "keywords": "排序 · 先后依赖 · 网络图",
    "group": "规划"
   },
   {
    "id": "schedule-4",
    "name": "估算活动持续时间",
    "keywords": "估算 · 工期 · 三点估算",
    "group": "规划"
   },
   {
    "id": "schedule-5",
    "name": "制订进度计划",
    "keywords": "制订 · 进度基准 · 关键路径",
    "group": "规划"
   },
   {
    "id": "schedule-6",
    "name": "控制进度",
    "keywords": "控制 · 进度偏差 · SPI",
    "group": "监控"
   }
  ],
  "poolOrder": [
   "schedule-4",
   "schedule-1",
   "schedule-6",
   "schedule-2",
   "schedule-5",
   "schedule-3"
  ]
 },
 {
  "key": "cost",
  "name": "成本管理",
  "memory": "成本 = 先定怎么花，再盯着别超支：定方针（规划成本管理）→ 估每项（估算成本）→ 汇总成基准（制定预算）（这 3 步都在「规划」）；然后控制成本、防超支（在「监控」）。",
  "cards": [
   {
    "id": "cost-1",
    "name": "规划成本管理",
    "keywords": "规划 · 成本方针 · 怎么估算",
    "group": "规划"
   },
   {
    "id": "cost-2",
    "name": "估算成本",
    "keywords": "估算 · 每个活动 · 花多少",
    "group": "规划"
   },
   {
    "id": "cost-3",
    "name": "制定预算",
    "keywords": "制定 · 成本基准 · 汇总预算",
    "group": "规划"
   },
   {
    "id": "cost-4",
    "name": "控制成本",
    "keywords": "控制 · 成本偏差 · CPI",
    "group": "监控"
   }
  ],
  "poolOrder": [
   "cost-3",
   "cost-1",
   "cost-4",
   "cost-2"
  ]
 },
 {
  "key": "quality",
  "name": "质量管理",
  "memory": "质量 = 看动词分三家：「规划」质量管理→规划组、「管理」质量→执行组、「控制」质量→监控组。三个过程名只差一个动词，动词就是过程组的信号：规划定标准、管理搞审计改过程、控制检查合不合格。",
  "cards": [
   {
    "id": "quality-1",
    "name": "规划质量管理",
    "keywords": "规划 · 质量标准 · 怎么达标",
    "group": "规划"
   },
   {
    "id": "quality-2",
    "name": "管理质量",
    "keywords": "管理 · 质量审计 · 过程改进",
    "group": "执行"
   },
   {
    "id": "quality-3",
    "name": "控制质量",
    "keywords": "控制 · 检查 · 是否合格",
    "group": "监控"
   }
  ],
  "poolOrder": [
   "quality-2",
   "quality-1",
   "quality-3"
  ]
 },
 {
  "key": "resource",
  "name": "资源管理",
  "memory": "资源 = 先规划（定职责 + 算需求，2 步在「规划」）→ 再执行（获取资源招人到位、建设团队练能力、管理团队盯绩效，3 步在「执行」）→ 最后控制资源盯实物够不够（在「监控」）。",
  "cards": [
   {
    "id": "resource-1",
    "name": "规划资源管理",
    "keywords": "规划 · 资源方针 · 角色职责",
    "group": "规划"
   },
   {
    "id": "resource-2",
    "name": "估算活动资源",
    "keywords": "估算 · 人力物料 · 需要多少",
    "group": "规划"
   },
   {
    "id": "resource-3",
    "name": "获取资源",
    "keywords": "获取 · 招人 · 资源到位",
    "group": "执行"
   },
   {
    "id": "resource-4",
    "name": "建设团队",
    "keywords": "建设 · 培训 · 团队凝聚",
    "group": "执行"
   },
   {
    "id": "resource-5",
    "name": "管理团队",
    "keywords": "管理 · 绩效反馈 · 解决冲突",
    "group": "执行"
   },
   {
    "id": "resource-6",
    "name": "控制资源",
    "keywords": "控制 · 实物资源 · 是否够用",
    "group": "监控"
   }
  ],
  "poolOrder": [
   "resource-4",
   "resource-1",
   "resource-6",
   "resource-2",
   "resource-5",
   "resource-3"
  ]
 },
 {
  "key": "communication",
  "name": "沟通管理",
  "memory": "沟通 = 又是看动词分三家：规划沟通管理（规划组）→ 管理沟通（执行组）→ 监督沟通（监控组）。这里监控组用的动词是「监督」——记住：「控制」和「监督」都是监控组的信号。",
  "cards": [
   {
    "id": "comm-1",
    "name": "规划沟通管理",
    "keywords": "规划 · 沟通方针 · 谁要什么信息",
    "group": "规划"
   },
   {
    "id": "comm-2",
    "name": "管理沟通",
    "keywords": "管理 · 收发信息 · 及时传递",
    "group": "执行"
   },
   {
    "id": "comm-3",
    "name": "监督沟通",
    "keywords": "监督 · 沟通效果 · 满不满足需求",
    "group": "监控"
   }
  ],
  "poolOrder": [
   "comm-2",
   "comm-1",
   "comm-3"
  ]
 },
 {
  "key": "risk",
  "name": "风险管理",
  "memory": "风险 = 规划阶段一口气 5 步：规划风险管理→识别风险→实施定性风险分析→实施定量风险分析→规划风险应对（都在规划组）。坑：定性/定量分析虽带「实施」二字，仍是规划组，分析是为做计划；真正到执行组的只有「实施风险应对」；「监督风险」在监控组。",
  "cards": [
   {
    "id": "risk-1",
    "name": "规划风险管理",
    "keywords": "规划 · 风险方针 · 怎么管风险",
    "group": "规划"
   },
   {
    "id": "risk-2",
    "name": "识别风险",
    "keywords": "识别 · 找出风险 · 风险登记册",
    "group": "规划"
   },
   {
    "id": "risk-3",
    "name": "实施定性风险分析",
    "keywords": "定性 · 概率影响 · 排优先级",
    "group": "规划"
   },
   {
    "id": "risk-4",
    "name": "实施定量风险分析",
    "keywords": "定量 · 数字量化 · 建模模拟",
    "group": "规划"
   },
   {
    "id": "risk-5",
    "name": "规划风险应对",
    "keywords": "规划 · 应对措施 · 应对策略",
    "group": "规划"
   },
   {
    "id": "risk-6",
    "name": "实施风险应对",
    "keywords": "实施 · 执行应对 · 落地",
    "group": "执行"
   },
   {
    "id": "risk-7",
    "name": "监督风险",
    "keywords": "监督 · 跟踪风险 · 有没有新风险",
    "group": "监控"
   }
  ],
  "poolOrder": [
   "risk-4",
   "risk-1",
   "risk-6",
   "risk-2",
   "risk-7",
   "risk-3",
   "risk-5"
  ]
 },
 {
  "key": "procurement",
  "name": "采购管理",
  "memory": "采购 = 看动词分三家：规划采购管理（规划组）定自制还是外购 → 实施采购（执行组）招标选供应商签合同 → 控制采购（监控组）管合同盯履约。跟风险里那两个「实施定性/定量分析」别搞混，它们其实是规划组；这里的实施采购才是真执行组。",
  "cards": [
   {
    "id": "proc-1",
    "name": "规划采购管理",
    "keywords": "规划 · 自制或外购 · 采购方针",
    "group": "规划"
   },
   {
    "id": "proc-2",
    "name": "实施采购",
    "keywords": "实施 · 选供应商 · 签合同",
    "group": "执行"
   },
   {
    "id": "proc-3",
    "name": "控制采购",
    "keywords": "控制 · 管理合同 · 监督履约",
    "group": "监控"
   }
  ],
  "poolOrder": [
   "proc-2",
   "proc-1",
   "proc-3"
  ]
 },
 {
  "key": "stakeholder",
  "name": "干系人管理",
  "memory": "干系人 = 一条龙用四个桶（只差收尾）：识别干系人（启动组，先找出谁受影响）→ 规划干系人参与（规划组，定怎么调动）→ 管理干系人参与（执行组，沟通协作满足期望）→ 监督干系人参与（监控组，看效果调策略）。记住：全项目 49 个过程里，启动组只有两个——制定项目章程和识别干系人。",
  "cards": [
   {
    "id": "stake-1",
    "name": "识别干系人",
    "keywords": "识别 · 找出干系人 · 干系人登记册",
    "group": "启动"
   },
   {
    "id": "stake-2",
    "name": "规划干系人参与",
    "keywords": "规划 · 参与策略 · 怎么调动",
    "group": "规划"
   },
   {
    "id": "stake-3",
    "name": "管理干系人参与",
    "keywords": "管理 · 沟通协作 · 满足期望",
    "group": "执行"
   },
   {
    "id": "stake-4",
    "name": "监督干系人参与",
    "keywords": "监督 · 参与效果 · 调整策略",
    "group": "监控"
   }
  ],
  "poolOrder": [
   "stake-3",
   "stake-1",
   "stake-4",
   "stake-2"
  ]
 }
];
