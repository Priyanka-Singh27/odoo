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

export interface ServiceRow {
  id: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  status: "Published" | "Draft";
}

export default function AppointmentsList() {
  // Empty data state for fetching from API later
  const services: ServiceRow[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-800">Services Offered</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> New Service
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-slate-50/50">
              <TableHead className="font-medium text-slate-600 h-12">Service Name</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Duration</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Price</TableHead>
              <TableHead className="font-medium text-slate-600 h-12">Status</TableHead>
              <TableHead className="font-medium text-slate-600 h-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium text-slate-800">{service.serviceName}</TableCell>
                  <TableCell className="text-slate-600">{service.durationMinutes} min</TableCell>
                  <TableCell className="text-slate-600">${service.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={service.status === "Published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                      {service.status}
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
                    <p>No services found.</p>
                    <button className="text-blue-500 hover:underline text-sm font-medium">Create your first service</button>
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
