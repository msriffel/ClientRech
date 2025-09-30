'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/actions';
import { ArrowLeft } from 'lucide-react';

export function AddClientForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createClient(formData);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Nova Empresa</h1>
        <p className="text-gray-600 mt-2">Cadastre uma nova empresa e seu contato principal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  required
                  placeholder="Ex: TechCorp Solutions"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://exemplo.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+55 11 99999-9999"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL do Logo</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  type="url"
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status Inicial *</Label>
                <Select name="status" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prospect Frio">Prospect Frio</SelectItem>
                    <SelectItem value="Prospect Morno">Prospect Morno</SelectItem>
                    <SelectItem value="Prospect Quente">Prospect Quente</SelectItem>
                    <SelectItem value="Cliente Ativo">Cliente Ativo</SelectItem>
                    <SelectItem value="Cliente Fiel">Cliente Fiel</SelectItem>
                    <SelectItem value="Cliente Inativo">Cliente Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextContactDate">Próximo Contato *</Label>
                <Input
                  id="nextContactDate"
                  name="nextContactDate"
                  type="datetime-local"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Contato Principal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Nome do Contato *</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    required
                    placeholder="Ex: João Silva"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactRole">Cargo *</Label>
                  <Input
                    id="contactRole"
                    name="contactRole"
                    required
                    placeholder="Ex: CEO, Diretor, Gerente"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    required
                    placeholder="joao@empresa.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    placeholder="+55 11 99999-9999"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Criar Empresa'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
