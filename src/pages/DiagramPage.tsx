import React, { useCallback, useMemo, useState} from "react";
import "@xyflow/react/dist/style.css";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  NodeTypes,
  Panel,
  ConnectionLineType,
  Position,
} from "@xyflow/react";
import { useData } from "../context/DataContext";
import TeamNode from "../components/TeamNode";
import UserNode from "../components/UserNode";
import dagre from "@dagrejs/dagre";
import { ArrowBigDown, ArrowBigRight } from "lucide-react";

// Dagre için gerekli yoksa çalışmıyor
const NODE_WIDTH = 172;
const NODE_HEIGHT = 36;

const DiagramPage: React.FC = () => {
  const { teams, users } = useData();
  const [layout, setLayout] = useState<"TB" | "LR">("TB");
   

  // initialNodes ile oluşturulacak node type'ları burdan geliyor
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      teamNode: TeamNode,
      userNode: UserNode,
    }),
    [],
  );

  // Kullanıcıları takımlarla eşleştir
  const teamChildrenMap = useMemo(() => {
    const map = new Map<string, string[]>();

    users.forEach((user) => {
      const teamId = user.teamId; //kUllanıcının bağlı olduğu takımın id'sini al
      if (!map.has(teamId)) { 
            map.set(teamId, []); // eğer takımda kimse yoksa boş bir dizi oluştur
      }
      map.get(teamId)?.push(user.id);//user'ı takıma ekle
    });

    return map;
  }, [users]);



  const initialNodes: Node[] = useMemo(() => {
    const teamNodes = teams.map((team) => ({
      id: team.id,
      type: "teamNode",
      data: {
        label: team.name,
        teamId: team.id,
        description: team.description,
        isExpanded: true,
        childrenIds: teamChildrenMap.get(team.id) || [], //Kullanıcıları listeler
      },
      position: { x: 0, y: 0 }, // Bunlar geçersiz. Dagree sonra yeniden hesaplıycak
    }));

    const userNodes = users.map((user) => {
      return {
        id: user.id,
        type: "userNode",
        data: { label: user.name, userId: user.id, role: user.role },
        position: { x: 0, y: 0 }, 
      };
    });
    return [...teamNodes, ...userNodes];
    
  }, [teams, users, teamChildrenMap]);

  
  // Team - User arası bağlantıları oluşturur
  const initialEdges: Edge[] = useMemo(() => {
    return users.map((user) => ({
      id: `e-${user.id}-${user.teamId}`,
      source: user.teamId,
      target: user.id,
      type: "smoothstep",
    }));
  }, [users]);

  // Dagrejs layout 
  const getLayoutedElements = useCallback(
    (nodes: Node[], edges: Edge[], direction: "TB" | "LR" = "TB") => {
      const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(
        () => ({}),
      );
      const isHorizontal = direction === "LR";

      dagreGraph.setGraph({ rankdir: direction });

      // Node'ların pozisyonlarını ayarlar
      nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
      });

      // Birleştirme çizgilerini ayarlar
      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      // otomatik yerleştirme algoritması
      dagre.layout(dagreGraph);

      //Hesaplanan yeni koordinatları verir.
      const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        return {
          ...node,
          targetPosition: isHorizontal ? Position.Left : Position.Top,
          sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
          position: {
            x: nodeWithPosition.x - NODE_WIDTH / 2,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
          },
        };
      });

      return { nodes: layoutedNodes, edges };
      
    },
    [],
  );

  // Node'ları ve edge'leri koordinat sisteminde yerleştir
  const layoutedElements = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges),
    [initialNodes, initialEdges, getLayoutedElements ],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    layoutedElements.nodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    layoutedElements.edges,
  );

 

  // Edge'leri ekler
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: ConnectionLineType.SmoothStep,
            animated: true,
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  // Layout dizilim yönü değiştirme
  const onLayoutChange = useCallback(
    (direction: "TB" | "LR") => {
      setLayout(direction);
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    },
    [nodes, edges, getLayoutedElements, setNodes, setEdges],
  );

  // Sağ tuş ile user node&edge gizleme
  const onToggleNodeVisibility = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const isCurrentlyExpanded = node.data.isExpanded;
            return {
              ...node,
              data: {
                ...node.data,
                isExpanded: !isCurrentlyExpanded,
              },
            };
          }

         
          const teamNode = nds.find((n) => n.id === nodeId);
          
          if (
            teamNode &&
            teamNode.data &&
            teamNode.data.childrenIds &&
            Array.isArray(teamNode.data.childrenIds) &&
            teamNode.data.childrenIds.includes(node.id)
          ) {
            return {
              ...node,
              hidden: Boolean(teamNode.data.isExpanded),
            };
          }
          return node;
        }),
      );

      setEdges(
        (eds) =>
          eds.map((edge) => {
            const teamNode = nodes.find((n) => n.id === nodeId);
           
            if (
              teamNode &&
              teamNode.data &&
              teamNode.data.childrenIds &&
              Array.isArray(teamNode.data.childrenIds) &&
              edge.source === nodeId &&
              teamNode.data.childrenIds.includes(edge.target)
            ) {
              return {
                ...edge,
                hidden: Boolean(teamNode.data.isExpanded),
              };
            }
            return edge;
          }) as Edge[],
      );
    },
    [nodes, setNodes, setEdges],
  );
  
  React.useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      layout
      
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [
    teams,
    users,
    initialNodes,
    initialEdges,
    setNodes,
    setEdges,
    getLayoutedElements,

    layout
    
  ]);

  return (
    <div className="h-full w-full">
      <div className="h-full">
        <div className="absolute top-40 right-2 text-gray-500 sm:top-20">
          <p>Kullanıcıyı sağ tuş ile silebilirsiniz</p>
          <p>Ekip listesini sağ tuş ile kapatabilirsiniz</p>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          nodesDraggable={true}
          panOnDrag={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
          // Mouse eventi tetikleyebilmek için çağrılan event
          onNodeContextMenu={(e, node) => {
            e.preventDefault();
            if (node.type === "teamNode") {
              onToggleNodeVisibility(node.id);
            }
          }}
        >
          <Background />
          <Controls />
          <Panel position="top-left">
            <button
              className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => onLayoutChange("TB")}
            >
              <ArrowBigDown/>
            </button>
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => onLayoutChange("LR")}
            >
              <ArrowBigRight/>
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default DiagramPage;
