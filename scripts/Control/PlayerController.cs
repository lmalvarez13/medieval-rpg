using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using RPG.Movement;
using RPG.Combat;
using RPG.Attributes;
using UnityEngine.EventSystems;
using UnityEngine.AI;

namespace RPG.Control 
{
    public class PlayerController : MonoBehaviour
    {
        Mover moverComp;
        Health health;

        [Serializable]
        struct CursorMapping
        {
            public CursorType type;
            public Texture2D texture;
            public Vector2 hotspot;
        }

        [SerializeField] CursorMapping[] cursorMappings = null;
        [SerializeField] float maxNavMeshProyectionDistance = 1.0f;
        float navMeshPathLength = 35f;

        void Awake()
        {
            health = GetComponent<Health>();
            moverComp = this.GetComponent<Mover>();
        }

        void Update()
        {
            if (InteractWithUI()) return;
            if (health.IsDead()){
                SetCursor(CursorType.None);
                return;
            }

            if (InteractWithComponent()) return;
            if (InteractWithMovement()) return;

            SetCursor(CursorType.None);
        }
        
        private bool InteractWithUI()
        {
            if (EventSystem.current.IsPointerOverGameObject())
            {
                SetCursor(CursorType.UI);
                return true;
            }

            return false;
        }

        private bool InteractWithComponent()
        {
            RaycastHit[] hits = RaycastAllSorted();
            foreach (RaycastHit hit in hits)
            {
                IRaycastable[] raycastables = hit.transform.GetComponents<IRaycastable>();
                foreach (IRaycastable raycastable in raycastables)
                {
                    if (raycastable.HandleRaycast(this))
                    {
                        SetCursor(raycastable.GetCursorType());
                        return true;
                    }
                }
            }

            return false;
        }

        RaycastHit[] RaycastAllSorted()
        {
            RaycastHit[] hits = Physics.RaycastAll(GetMouseRay());

            float[] distances = new float[hits.Length];

            for (int i = 0; i < hits.Length; i++)
                distances[i] = hits[i].distance;

            Array.Sort(distances, hits);

            return hits;
        }
        
        private bool InteractWithMovement()
        {
            //RaycastHit hit;
            //bool hasHit = Physics.Raycast(GetMouseRay(), out hit);
            Vector3 target;
            bool hasHit = RaycastNavMesh(out target);

            if (hasHit)
            {
                if (Input.GetMouseButton(0))
                {
                    moverComp.StartMoveAction(target, 1f);
                }
                SetCursor(CursorType.Movement);

                return true;
            }
            return false;
        }

        private bool RaycastNavMesh(out Vector3 target)
        {
            target = new Vector3();

            RaycastHit hit;
            bool hasHit = Physics.Raycast(GetMouseRay(), out hit);
            if (!hasHit) return false;

            NavMeshHit navMeshHit;
            bool hasCastToNavMesh = NavMesh.SamplePosition(
                    hit.point, out navMeshHit, maxNavMeshProyectionDistance, NavMesh.AllAreas);
            if (!hasCastToNavMesh) return false;

            target = navMeshHit.position;

            // In this case we're not using 'out' parameter since NavMeshPath is made as a class instead of a struct.
            // This means that a class can be either 'null' or some value, so by using the constructor we're certifying that it is not a null object.
            // Otherwise, structs always have some value assigned. In C# references can also be null, therefore we pass an object so it can be modified.
            NavMeshPath path = new NavMeshPath();
            bool hasPath = NavMesh.CalculatePath(transform.position, target, NavMesh.AllAreas, path);
            if (!hasPath) return false;
            if (path.status != NavMeshPathStatus.PathComplete) return false;
            if (GetPathLength(path) > navMeshPathLength) return false;

            return true;
        }

        private float GetPathLength(NavMeshPath path)
        {
            float totalDistance = 0f;
            if (path.corners.Length < 2) return totalDistance;

            for (int i = 0; i < path.corners.Length - 1; i++)
                totalDistance += Vector3.Distance(path.corners[i], path.corners[i + 1]);

            return totalDistance;
        }

        private void SetCursor(CursorType type)
        {
            CursorMapping mapping = GetCursorMapping(type);
            Cursor.SetCursor(mapping.texture, mapping.hotspot, CursorMode.Auto);
        }

        private CursorMapping GetCursorMapping(CursorType type)
        {
            foreach (CursorMapping cursorMapping in cursorMappings)
            {
                if (cursorMapping.type == type)
                    return cursorMapping;
            }

            return cursorMappings[0];
        }

        private static Ray GetMouseRay()
        {
            return Camera.main.ScreenPointToRay(Input.mousePosition);
        }
    }
}
