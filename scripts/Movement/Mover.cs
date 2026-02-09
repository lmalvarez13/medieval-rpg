using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using RPG.Core;
using RPG.Saving;
using RPG.Attributes;

namespace RPG.Movement
{
    public class Mover : MonoBehaviour, IAction, ISaveable
    {
        [SerializeField] Transform target;
        [SerializeField] float maxSpeed = 6f;
        Vector3 velocity;
        NavMeshAgent navmesh;
        Health health;

        void Awake()
        {
            navmesh = this.GetComponent<NavMeshAgent>();
            health = GetComponent<Health>();
        }

        void Update()
        {
            if (health.IsDead()) navmesh.enabled = false;
            UpdateAnimator();
        }
        
        private void UpdateAnimator()
        {
            velocity = navmesh.velocity;
            Vector3 localVelocity = transform.InverseTransformDirection(velocity);
            float speed = localVelocity.z;
            GetComponent<Animator>().SetFloat("forwardSpeed", speed);
        }
        
        public void StartMoveAction(Vector3 destination, float speedFraction)
        {
            GetComponent<ActionScheduler>().StartAction(this);
            MoveTo(destination, speedFraction);
        }

        public void MoveTo(Vector3 destination, float speedFraction)
        {
            navmesh.destination = destination;
            navmesh.speed = maxSpeed * Mathf.Clamp01(speedFraction);
            navmesh.isStopped = false;
        }

        public void Cancel()
        {
            navmesh.isStopped = true; 
        }

        public object CaptureState()
        {
            Dictionary<string, object> data = new Dictionary<string, object>();
            data["position"] = new SerializableVector3(transform.position);
            data["rotation"] = new SerializableVector3(transform.eulerAngles);
            return data;
        }

        public void RestoreState(object state)
        {
            Dictionary<string, object> data = (Dictionary<string,object>)state;
            navmesh.enabled = false;
            transform.position = ((SerializableVector3) data["position"]).ToVector();
            transform.eulerAngles = ((SerializableVector3)data["rotation"]).ToVector();
            navmesh.enabled = true;
        }
    }
}
