import React, { useState, useEffect } from 'react';
import { EnhancedResultPageEditor } from '@/components/result-editor/EnhancedResultPageEditor';
import { useQuiz } from '@/hooks/useQuiz';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Este componente serve como um ponto de entrada para o editor visual aprimorado
// da página de resultados, permitindo acesso através do sistema de roteamento
const EnhancedResultPageEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { primaryStyle, secondaryStyles } = useQuiz();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Verificar se o usuário tem acesso de administrador
  useEffect(() => {
    // Verificar se o usuário tem role = 'admin'
    const isAdmin = user && 
      typeof user === 'object' && 
      'role' in user && 
      user.role === 'admin';
    
    if (!isAdmin) {
      // Tentar configurar acesso de admin se não estiver configurado
      const savedRole = localStorage.getItem('userRole');
      
      if (savedRole === 'admin') {
        // O localStorage tem o role admin, mas o AuthContext não.
        // Isso pode acontecer se o script foi executado após o carregamento da aplicação.
        // Recarregar a página para atualizar o contexto.
        toast({
          title: "Recarregando página",
          description: "Detectamos que você tem acesso de administrador. Recarregando para aplicar as configurações.",
        });
        
        // Recarregar a página após um breve delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
        return;
      }
      
      // O usuário não tem acesso de admin
      toast({
        title: "Acesso Restrito",
        description: "Você não tem permissão para acessar esta página. Execute o script de acesso admin no console.",
        variant: "destructive"
      });
      
      // Redirecionar para a página de resultado após um breve delay
      const timer = setTimeout(() => {
        navigate('/resultado');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);
  
  // Verificar se há estilos carregados
  useEffect(() => {
    if (!primaryStyle) {
      toast({
        title: "Não foi possível carregar os dados do estilo",
        description: "Você será redirecionado para a página de resultado.",
        variant: "destructive"
      });
      
      // Redirecionar para a página de resultado após um breve delay
      const timer = setTimeout(() => {
        navigate('/resultado');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [primaryStyle, navigate]);
  
  // Carregar o funil do localStorage se existir
  const [initialFunnel, setInitialFunnel] = useState<any>(null);
  
  useEffect(() => {
    try {
      const savedFunnel = localStorage.getItem('currentQuizFunnel');
      if (savedFunnel) {
        setInitialFunnel(JSON.parse(savedFunnel));
      }
    } catch (error) {
      console.error('Erro ao carregar o funil:', error);
    }
  }, []);
  
  // Função para salvar o funil
  const handleSaveFunnel = (funnel: any) => {
    setIsLoading(true);
    
    try {
      // Salvar no localStorage para persistência local
      localStorage.setItem('currentQuizFunnel', JSON.stringify(funnel));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações da página de resultado foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar o funil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar se o usuário tem acesso de administrador
  const isAdmin = user && 
    typeof user === 'object' && 
    'role' in user && 
    user.role === 'admin';
  
  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="mb-6">Esta página requer privilégios de administrador. Execute o script de acesso admin no console do navegador.</p>
          <Button onClick={() => navigate('/resultado')}>
            Voltar para Resultados
          </Button>
        </div>
      </div>
    );
  }
  
  if (!primaryStyle) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Carregando...</h2>
          <p>Preparando o editor da página de resultado.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="border-b bg-white p-4 flex items-center justify-between shadow-sm">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/resultado')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-xl font-semibold text-[#432818]">Editor da Página de Resultado</h1>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => {
            toast({
              title: "Alterações salvas",
              description: "As configurações foram salvas com sucesso.",
            });
          }}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </div>
      
      <div className="p-4">
        <EnhancedResultPageEditor
          primaryStyle={primaryStyle}
          secondaryStyles={secondaryStyles || []}
          initialFunnel={initialFunnel}
          onSave={handleSaveFunnel}
        />
      </div>
    </div>
  );
};

export default EnhancedResultPageEditorPage;