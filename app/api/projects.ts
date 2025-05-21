export async function createProject(projectData: any) {
  const response = await fetch('https://ofgen.cognitron.co.ke/ofgen/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create project');
  }

  return response.json();
}

export async function getProjects() {
  const response = await fetch('https://ofgen.cognitron.co.ke/ofgen/api/projects', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch projects');
  }
  const data = await response.json();
  // Patch: always return arrays for milestones, inventoryUsage, risks, tasks
  return Array.isArray(data)
    ? data.map((project) => ({
        ...project,
        milestones: Array.isArray(project.milestones) ? project.milestones : [],
        inventoryUsage: Array.isArray(project.inventoryUsage) ? project.inventoryUsage : [],
        risks: Array.isArray(project.risks) ? project.risks : [],
        tasks: Array.isArray(project.tasks) ? project.tasks : [],
      }))
    : [];
}

export async function getProjectById(id: string) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/projects/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch project');
  }
  return response.json();
}

export async function updateProject(id: string, projectData: any) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update project');
  }
  return response.json();
}

export async function deleteProject(id: string) {
  const response = await fetch(`https://ofgen.cognitron.co.ke/ofgen/api/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete project');
  }
  return response.json();
}
