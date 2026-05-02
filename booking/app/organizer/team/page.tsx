"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface ProviderRow {
  id: string;
  name: string;
  specialty: string;
  assignedServices: string[];
  status: "Active" | "Inactive";
}

export default function TeamList() {
  // Empty data state for fetching from API later
  const providers: ProviderRow[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-800">Team Members</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add Provider
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-slate-50/50">
              <TableHead className="font-medium text-slate-600 h-12">Provider Name</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Specialty</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Assigned Services</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Status</TableHead>
              <TableHead className="font-medium text-slate-600 h-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.length > 0 ? (
              providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium text-slate-800">{provider.name}</TableCell>
                  <TableCell className="text-slate-600">{provider.specialty}</TableCell>
                  <TableCell className="text-slate-600">
                    <div className="flex gap-1 flex-wrap">
                      {provider.assignedServices.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{s}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={provider.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                      {provider.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <p>No team members found.</p>
                    <button className="text-blue-500 hover:underline text-sm font-medium">Add your first team member</button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
