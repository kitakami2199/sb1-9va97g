import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type Employee = {
  id: number
  name: string
  skills: string[]
}

type JobRole = {
  id: number
  title: string
  requiredSkills: string[]
}

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "山田太郎", skills: ["プロジェクト管理", "リーダーシップ", "コミュニケーション"] },
    { id: 2, name: "佐藤花子", skills: ["データ分析", "プログラミング", "問題解決"] },
  ])
  const [jobRoles, setJobRoles] = useState<JobRole[]>([
    { id: 1, title: "プロジェクトマネージャー", requiredSkills: ["プロジェクト管理", "リーダーシップ", "コミュニケーション"] },
    { id: 2, title: "データサイエンティスト", requiredSkills: ["データ分析", "プログラミング", "統計学"] },
  ])

  const [newEmployee, setNewEmployee] = useState({ name: '', skills: '' })
  const [newJobRole, setNewJobRole] = useState({ title: '', skills: '' })

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.skills) {
      setEmployees([...employees, {
        id: employees.length + 1,
        name: newEmployee.name,
        skills: newEmployee.skills.split(',').map(skill => skill.trim())
      }])
      setNewEmployee({ name: '', skills: '' })
    }
  }

  const addJobRole = () => {
    if (newJobRole.title && newJobRole.skills) {
      setJobRoles([...jobRoles, {
        id: jobRoles.length + 1,
        title: newJobRole.title,
        requiredSkills: newJobRole.skills.split(',').map(skill => skill.trim())
      }])
      setNewJobRole({ title: '', skills: '' })
    }
  }

  const calculateMatch = (employeeSkills: string[], jobSkills: string[]) => {
    const matchedSkills = employeeSkills.filter(skill => jobSkills.includes(skill))
    return (matchedSkills.length / jobSkills.length) * 100
  }

  const matchData = employees.map(employee => ({
    name: employee.name,
    ...jobRoles.reduce((acc, job) => ({
      ...acc,
      [job.title]: calculateMatch(employee.skills, job.requiredSkills)
    }), {})
  }))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">スキルマッチングダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>従業員追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="employeeName">名前</Label>
                <Input
                  id="employeeName"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="employeeSkills">スキル（カンマ区切り）</Label>
                <Input
                  id="employeeSkills"
                  value={newEmployee.skills}
                  onChange={(e) => setNewEmployee({...newEmployee, skills: e.target.value})}
                />
              </div>
              <Button onClick={addEmployee}>追加</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>職種追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="jobTitle">職種名</Label>
                <Input
                  id="jobTitle"
                  value={newJobRole.title}
                  onChange={(e) => setNewJobRole({...newJobRole, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="jobSkills">必要スキル（カンマ区切り）</Label>
                <Input
                  id="jobSkills"
                  value={newJobRole.skills}
                  onChange={(e) => setNewJobRole({...newJobRole, skills: e.target.value})}
                />
              </div>
              <Button onClick={addJobRole}>追加</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">従業員スキル</h2>
        <div className="space-y-4">
          {employees.map(employee => (
            <Card key={employee.id}>
              <CardContent className="flex items-center justify-between p-4">
                <span className="font-medium">{employee.name}</span>
                <div>
                  {employee.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="mr-1">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">職種別必要スキル</h2>
        <div className="space-y-4">
          {jobRoles.map(job => (
            <Card key={job.id}>
              <CardContent className="flex items-center justify-between p-4">
                <span className="font-medium">{job.title}</span>
                <div>
                  {job.requiredSkills.map(skill => (
                    <Badge key={skill} variant="outline" className="mr-1">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">スキルマッチング結果</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={matchData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {jobRoles.map(job => (
              <Bar key={job.id} dataKey={job.title} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}